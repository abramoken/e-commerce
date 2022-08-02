import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Row, Col, Form} from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listUsers, deleteUser } from '../actions/userActions'

function UserListScreen({ history}) {
    const dispatch = useDispatch()
    const userList = useSelector(state => state.userList)
    const {loading, error, users} = userList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const { success:successDelete } = userDelete

    useEffect(() => {
        if(userInfo && userInfo.isAdmin){
            dispatch(listUsers())
        }else{
            history.push('/login')
        }
    }, [dispatch, history, userInfo, successDelete])

    const deleteHandler = (id) => {
        if(window.confirm('Are you sure you want to delete this User?')){
            dispatch(deleteUser(id))
        }
    }

    const onChange = (e) => {
        console.log(e.target.value)
    }

  return (
    <div>
        <Row className='align-items-center'>
            <Col md={4}><h1>Users</h1></Col>
            <Col md={4}>
                <Form inline className='d-flex'>
                    <Form.Group controlId="text">
                        <Form.Control
                            type='text'
                            name='q'
                            onChange={onChange}
                            className='mr-sm-2 ml-sm-5'
                        ></Form.Control>
                    </Form.Group>
                </Form>
            </Col>
            <Col md={4} className='text-right'>
            </Col>
        </Row>
        {loading 
        ? <Loader/> 
        : error 
        ? <Message variant='danger'>{error}</Message>
        : (
            <Table striped responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? <i className='fas fa-check' style={{ color: 'green' }}></i> : (
                                <i className='fas fa-check' style={{ color: 'red' }}></i>
                            )}</td>
                            <td>
                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                    <Button className='btn-sm' variant='light'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>
                                <Button className='btn-sm' variant='danger' onClick={() => deleteHandler(user._id)}>
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )}
    </div>
  )
}

export default UserListScreen