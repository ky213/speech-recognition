export async function recognizeSpeech(audioData, currentWord) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioStream: audioData, textToCheck: currentWord }),
  }

  return fetch(
    `https://api.staging.lxpia.com/api/users/speechToText`,
    requestOptions
  )
    .then(response => response)
    .then(data => {
      return data
    })
}
