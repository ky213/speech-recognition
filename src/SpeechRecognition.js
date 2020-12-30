import React, { useState, useEffect } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMicrophone,
  faStop,
  faCheck,
  faRedo,
} from '@fortawesome/free-solid-svg-icons'
import { recognizeSpeech } from './services'
import WordsSlide from './WordsSlide'
import { Container, Row, Col, Alert, Button } from 'reactstrap'
import Loading from './Loading'

const SpeechRecognition = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [recognizing, setRecognizing] = useState(false)
  const [recognitionResult, setRecognitionResult] = useState(null)
  const [currentWord, setCurrentWord] = useState('')
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    error: recorderError,
  } = useReactMediaRecorder({
    audio: true,
  })
  const recording = status === 'recording'

  useEffect(() => {
    if (mediaBlobUrl) handleRecognition()
  }, [mediaBlobUrl])

  useEffect(() => {
    if (recorderError) setErrorMessage(recorderError)
  }, [recorderError])

  const getSpeechRecognition = async data => {
    try {
      setRecognizing(true)
      setRecognitionResult(null)

      const result = await recognizeSpeech(data, currentWord)
      console.log(result)
      setRecognitionResult(result)
      setRecognizing(false)
    } catch (error) {
      setRecognizing(false)
      setErrorMessage(error.message)
      setRecognitionResult(null)
    }
  }

  const handleRecognition = async () => {
    const reader = new FileReader()
    const response = await fetch(mediaBlobUrl)
    const blob = await response.blob()

    reader.readAsDataURL(blob)
    reader.onloadend = function () {
      const base64data = reader.result.split(',')[1]
      if (!recognizing) getSpeechRecognition(base64data)
    }
  }

  return (
    <Container className="w-50 mt-5">
      <Row>
        <Col>
          {errorMessage && (
            <Alert
              color="danger"
              isOpen={errorMessage !== null}
              toggle={() => setErrorMessage(null)}
            >
              Error: {errorMessage}
            </Alert>
          )}
        </Col>
      </Row>
      <Row>
        <Col
          className="h-50 my-4 position-relative"
          style={{ height: '200px' }}
        >
          <WordsSlide
            setCurrentWord={setCurrentWord}
            setRecognitionResult={setRecognitionResult}
          />
          <h3
            className="position-absolute text-center w-100 "
            style={{ bottom: '30px', left: '0' }}
          >
            {recognitionResult?.found &&
              recognitionResult?.transcription === currentWord && (
                <span className="text-info">
                  <FontAwesomeIcon icon={faCheck} /> أحسنت
                </span>
              )}
            {recognitionResult &&
              recognitionResult.transcription !== currentWord && (
                <span className="text-danger">
                  <FontAwesomeIcon icon={faRedo} /> حاول مرة أخرى
                </span>
              )}
          </h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row>
            <Col>
              <Button
                color={`${recording ? 'danger' : 'info'}`}
                size="lg"
                block
                outline={!recording}
                disabled={recognizing}
                onClick={() => {
                  if (['idle', 'stopped'].includes(status)) startRecording()
                  else {
                    stopRecording()
                  }
                }}
              >
                {recognizing ? (
                  <Loading small />
                ) : (
                  <>
                    <FontAwesomeIcon icon={recording ? faStop : faMicrophone} />
                    <span>
                      {recording ? ' Stop Recording' : ' Start Recording'}
                    </span>
                  </>
                )}
              </Button>
            </Col>
            <Col>
              <audio
                src={mediaBlobUrl}
                controls
                autoplay
                loop
                style={{ maxHeight: '40px', width: '100%' }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default SpeechRecognition
