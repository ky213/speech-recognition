import React, { useState, useEffect } from 'react'
import { Carousel, CarouselItem, CarouselControl, Card } from 'reactstrap'

const WordsSlide = ({ setCurrentWord, setRecognitionResult }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const items = [
    {
      text: 'مرحبا',
    },
    {
      text: 'شجرة',
    },
    {
      text: 'الماء',
    },
    {
      text: 'القمر',
    },
    {
      text: 'سيارة',
    },
    {
      text: 'هاتف',
    },
    {
      text: 'خبز',
    },
    {
      text: 'نظارات',
    },
    {
      text: 'منزل',
    },
    {
      text: 'باب',
    },
  ]

  useEffect(() => {
    setCurrentWord(items[activeIndex].text)
    setRecognitionResult(null)
  }, [activeIndex])

  const next = () => {
    if (animating) return
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) return
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
    setActiveIndex(nextIndex)
  }

  const slides = items.map(item => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.text}
        tag="h1"
      >
        <Card className="p-5" style={{ height: '300px' }}>
          <h1 className="text-center mt-5">{item.text}</h1>
        </Card>
      </CarouselItem>
    )
  })

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      autoPlay={false}
      interval={false}
    >
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
        className="text-danger bg-info h-50 m-auto"
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
        className="text-danger bg-info h-50 m-auto"
      />
    </Carousel>
  )
}

export default WordsSlide
