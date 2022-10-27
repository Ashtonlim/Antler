import { useState, useEffect, useRef } from 'react'

import protobuf from 'protobufjs'

const useYfws = (subs) => {
  const ref = useRef(subs)
  const [next, setNext] = useState(0)
  // console.log({ subs, ref })
  useEffect(() => {
    // do open here, prevent running it twice????
    protobuf.load('./YPricingData.proto', (error, root) => {
      if (error) return alert(error)

      const yfticker = root.lookupType('yfticker')
      const ws = new WebSocket('wss://streamer.finance.yahoo.com/')
      ws.onopen = () => {
        // console.log({ subs, ref: ref.current })
        ws.send(JSON.stringify({ subscribe: ref.current }))
        // console.log("connected");
      }

      // when does this dc?
      ws.onclose = () => console.log('dc')

      ws.onmessage = (message) => {
        // console.log('hi 2')
        // new Buffer(data, "base64") ===  Uint8Array.from(window.atob(data), (c) => c.charCodeAt(0))
        // avoiding Buffer to avoid installing Buffer package.
        // data is a Base64 encoded binary string (binary represented as ascii) that is converted to arr of integers.
        // atob converts the Ascii TO Binary -> (ATOB) and
        // the following => fn is just mapping the binary array produced into integers
        // to test: window.atob(message.data).split('').map(c => c.charCodeAt(0))
        // atob produces a string, split converts to arr, map so u can return arr of integers
        // const next = yfticker.decode(new Buffer(message.data, "base64")); // prev usage

        setNext(
          yfticker.decode(
            Uint8Array.from(window.atob(message.data), (c) => c.charCodeAt(0))
          )
        )
      }
    })
  }, [])

  return { next }
}

export default useYfws
