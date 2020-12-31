import React, { useState, useEffect } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMicrophone,
  faStop,
  faCheck,
  faRedo,
  faPhoneVolume,
  faVolumeUp,
} from '@fortawesome/free-solid-svg-icons'
import { recognizeSpeech } from './services'
import { Container, Row, Col, Alert, Button, Card } from 'reactstrap'
import Loading from './Loading'

const currentWord = 'أَحْمَد مُعَلِّمٌ'

const SpeechRecognition = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [recognizing, setRecognizing] = useState(false)
  const [recognitionResult, setRecognitionResult] = useState('')
  // const [currentWord, setCurrentWord] = useState('')
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

  useEffect(() => {}, [recognitionResult])

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
      <Card className="p-4">
        <Row>
          <Col>
            <h3 className="text-right">
              {currentWord}{' '}
              <FontAwesomeIcon icon={faVolumeUp} style={{ fontSize: '24px' }} />
            </h3>
          </Col>
        </Row>
        <Row>
          <Col className="text-center w-100">
            <Button
              color={`${recording ? 'danger' : 'primary'}`}
              disabled={recognizing}
              onClick={() => {
                if (['idle', 'stopped'].includes(status)) startRecording()
                else {
                  stopRecording()
                }
              }}
              style={{ width: '80px', height: '80px', fontSize: '32px' }}
            >
              {recognizing ? (
                <Loading small />
              ) : (
                <FontAwesomeIcon icon={recording ? faStop : faMicrophone} />
              )}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col
            className="h-50 my-4 position-relative"
            style={{ height: '200px' }}
          >
            <h3
              className={`text-center text-${
                recognitionResult?.transcription === currentWord
                  ? 'success'
                  : 'danger'
              }`}
            >
              {recognitionResult?.transcription}
            </h3>
            <h3 className="text-center w-100 ">
              {recognitionResult?.found &&
                recognitionResult?.transcription === currentWord && (
                  <span className="text-success">
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                )}
              {recognitionResult &&
                recognitionResult.transcription !== currentWord && (
                  <span className="text-danger">
                    <FontAwesomeIcon icon={faRedo} />
                  </span>
                )}
            </h3>
          </Col>
        </Row>
      </Card>
    </Container>
  )
}

export default SpeechRecognition
