import React, { useState} from 'react'
import { Button, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

function SearchBox() {
    const [keyword, setKeyword] = useState('')
    let history = useHistory()

    const submitHandler = (e) => {
        e.preventDefault()
        if(keyword){
            history.push(`/?search=${keyword}&page=1`)
        }else{
            history.push(history.push(history.location.pathname))
        }
    }

  return (
    <Form onSubmit={submitHandler} inline className='d-flex'>
        <Form.Control
            type='text'
            name='q'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className='mr-sm-2 ml-sm-5'
        ></Form.Control>

        <Button
            type='submit'
            variant='outline-success'
        >Search</Button>
    </Form>
  )
}

export default SearchBox