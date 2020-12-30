import React from 'react'
import classNames from 'classnames'
import { Row, Col, CardBody } from 'reactstrap'

import { loader } from './Loading.css'

const Loading = ({ small }) => {
  return (
    <React.Fragment>
      <CardBody className={classNames({ 'p-0': small, 'm-0': small })}>
        <Row className={classNames({ 'p-0': small, 'm-0': small })}>
          <Col className={classNames({ 'p-0': small, 'm-0': small })}>
            <div
              className={loader}
              style={small && { width: '20px', height: '20px' }}
            ></div>
          </Col>
        </Row>
      </CardBody>
    </React.Fragment>
  )
}

export default Loading
