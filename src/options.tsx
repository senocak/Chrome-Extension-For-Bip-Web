import React, { useEffect, useState } from "react"
import {createRoot, Root} from "react-dom/client"

const Options: () => React.JSX.Element = (): React.JSX.Element => {
  const [color, setColor] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [like, setLike] = useState<boolean>(false)
  useEffect((): void => {
    chrome.storage.sync.get(
      {
        favoriteColor: "red",
        likesColor: true,
      },
      (items): void => {
        setColor(items.favoriteColor)
        setLike(items.likesColor)
      }
    )
  }, [])
  const saveOptions: () => void = (): void => {
    chrome.storage.sync.set(
      {
        favoriteColor: color,
        likesColor: like,
      },
      (): () => void => {
        setStatus("Options saved.")
        const id = setTimeout((): void => {setStatus("")}, 1000)
        return (): void => clearTimeout(id)
      }
    )
  }
  return (
    <>
      <div>
        Favorite color: <select
          value={color}
          onChange={(event): void => setColor(event.target.value)}
        >
          <option value="red">red</option>
          <option value="green">green</option>
          <option value="blue">blue</option>
          <option value="yellow">yellow</option>
        </select>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={like}
            onChange={(event): void => setLike(event.target.checked)}
          />
          I like colors.
        </label>
      </div>
      <div>{status}</div>
      <button onClick={saveOptions}>Save</button>
    </>
  )
}
const root: Root = createRoot(document.getElementById("root")!)
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
)
