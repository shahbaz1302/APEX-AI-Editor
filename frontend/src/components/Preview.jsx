import { useEffect, useMemo, useState } from "react"

const Preview = ({ tree }) => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  )

  useEffect(() => {
    const themeObserver = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"))
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => themeObserver.disconnect()
  }, [])

  const srcDocument = useMemo(() => {
    let html = null
    const stylesheets = []
    const scripts = []

    const walk = (items) => {
      if (!Array.isArray(items)) return
      for (const item of items) {
        if (item.type === "file") {
          const name = item.name?.toLowerCase()
          if (name === "index.html") html = item.content || ""
          if (name?.endsWith(".css")) stylesheets.push(item.content || "")
          if (name?.endsWith(".js")) scripts.push(item.content || "")
        }
        walk(item.children)
      }
    }
    walk(tree)

    html ??= `<!doctype html>
      <html lang="en">
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
        <body style="margin:0;min-height:100vh;display:grid;place-content:center;font-family:system-ui,sans-serif;color:#64748b">
          <main style="text-align:center">
            <h3 style="margin:0 0 6px">No index.html found</h3>
            <p style="margin:0;font-size:13px">Create an HTML file named index.html to see the preview</p>
          </main>
        </body>
      </html>`

    const scrollbarStyle = `
      :root {
        scrollbar-color: ${isDark ? "#64748b #202631" : "#aeb8c5 #e8edf4"};
        scrollbar-width: thin;
      }
      ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        border: 2px solid transparent;
        border-radius: 9999px;
        background-clip: padding-box;
        box-shadow: inset 1px 1px 2px ${isDark ? "#394454a6" : "#ffffffa6"},
          inset -1px -1px 2px ${isDark ? "#11161d99" : "#aeb8c566"},
          1px 1px 3px ${isDark ? "#171c24" : "#c5cbd366"},
          -1px -1px 3px ${isDark ? "#2a334166" : "#ffffffa6"};
      }
      ::-webkit-scrollbar-thumb:hover {
        box-shadow: inset 1px 1px 2px ${isDark ? "#394454a6" : "#ffffffa6"},
          inset -1px -1px 2px ${isDark ? "#11161d99" : "#aeb8c566"},
          2px 2px 4px ${isDark ? "#171c24" : "#c5cbd366"},
          -2px -2px 4px ${isDark ? "#2a334166" : "#ffffffa6"};
      }
    `
    const styleBlock = `<style>${stylesheets.join("\n")}${scrollbarStyle}</style>`
    if (/<\/head\s*>/i.test(html)) {
      html = html.replace(/<\/head\s*>/i, `${styleBlock}</head>`)
    } else {
      html = `${styleBlock}${html}`
    }

    if (scripts.length) {
      const scriptBlock = `<script>\n${scripts.join("\n")}\n</script>`
      if (/<\/body\s*>/i.test(html)) {
        html = html.replace(/<\/body\s*>/i, `${scriptBlock}</body>`)
      } else {
        html += scriptBlock
      }
    }
    return html
  }, [tree, isDark])

  return (
    <div className="flex h-full min-h-0 min-w-0 w-full flex-1 flex-col gap-3 text-slate-700 dark:text-slate-200">
      <div className="flex shrink-0 items-center justify-between rounded-xl bg-[#e8edf4] px-4 py-3 pr-64 shadow-[5px_5px_10px_#c5cbd3,-5px_-5px_10px_#ffffff] dark:bg-[#202631] dark:shadow-[5px_5px_10px_#171c24,-5px_-5px_10px_#2a3341]">
        <span className="rounded-lg bg-[#e8edf4] px-3 py-1.5 text-sm font-semibold tracking-wide text-slate-600 shadow-[inset_2px_2px_4px_#c5cbd3,inset_-2px_-2px_4px_#ffffff] dark:bg-[#202631] dark:text-slate-300 dark:shadow-[inset_2px_2px_4px_#171c24,inset_-2px_-2px_4px_#2a3341]">
          Preview
        </span>
      </div>

      <div className="min-h-0 min-w-0 w-full flex-1 overflow-hidden rounded-xl bg-[#e8edf4] p-2 shadow-[inset_4px_4px_8px_#c5cbd3,inset_-4px_-4px_8px_#ffffff] dark:bg-[#202631] dark:shadow-[inset_4px_4px_8px_#171c24,inset_-4px_-4px_8px_#2a3341]">
        <iframe
          title="Project Preview"
          srcDoc={srcDocument}
          sandbox="allow-scripts allow-forms"
          className="block h-full min-h-0 w-full rounded-lg border-0 bg-white shadow-[2px_2px_5px_#c5cbd3,-2px_-2px_5px_#ffffff] dark:bg-[#202631] dark:shadow-[2px_2px_5px_#171c24,-2px_-2px_5px_#2a3341]"
        />
      </div>
    </div>
  )
}

export default Preview