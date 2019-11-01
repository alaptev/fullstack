import { WS_HOST } from './host_constants'

const openConnection = () => { return new WebSocket(`${WS_HOST}/cable`) }

export const subscribe = (appStore) => {
  const realTimeWebSocket = openConnection();
  realTimeWebSocket.onopen = (event) => {
    const identifierMsg = JSON.stringify({
      "channel":"RealTimeChannel"
    })
    const subscribeMsg = {
      "command":"subscribe",
      "identifier":identifierMsg
    }
    realTimeWebSocket.send(JSON.stringify(subscribeMsg))
  }
  realTimeWebSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('---log--- data = ', data)
    if (data.message === 'ARTICLES_WERE_UPDATED') {
      appStore.getArticles();
    }
  }
}
