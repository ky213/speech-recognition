export async function recognizeSpeech(audioData, currentWord) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioStream: audioData, textToCheck: currentWord }),
  }

  const response  = await fetch(
    `https://api.staging.lxpia.com/api/users/speechToText`,
    requestOptions
  )
  const data = await response.json()
  return data
    
}
