import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button} from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

function ProductEditScreen({ match, history }) {
    const productId = match.params.id
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [countInStock, setCountInStok] = useState(0)
    const [uploading, setUploading] = useState(false)



    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { error, loading, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { error: errorUpdate, loading: loadingUpdate, success:successUpdate } = productUpdate


    useEffect(() => {
        if(successUpdate){
            dispatch({ type: PRODUCT_UPDATE_RESET })
            history.push('/admin/productlist')
        }else {
            if(!product.name || product._id !== Number(productId)){
                dispatch(listProductDetails(productId))
            }else{
                setName(product.name)
                setPrice(product.price)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStok(product.countInStock)
                setImage(product.image)
                setDescription(product.description)
            }
        }
        
    }, [dispatch, product, productId, history, successUpdate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({ _id: product._id, name, price, brand, category, countInStock, image, description }))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        formData.append('product_id', productId)
        setUploading(true)

        try{
            const config = {
                Headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const { data } = await axios.post('/api/products/upload/', formData, config)
            setImage(data)
            setUploading(false)
        }catch(error){
            setUploading(true)
        }
    }

    return (
    <div>
        <Link to='/admin/productlist'>Go Back</Link>
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader /> }
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

            {loading ? <Loader/> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder='Enter Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >
                        </Form.Control>
                </Form.Group>
                <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder='Enter Price'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="brand">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder='Enter Brand'
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="image">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder='Enter Image'
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    >
                    </Form.Control>
                    <Form.File
                        id='image-file'
                        label='Browse File'
                        custom
                        onChange={uploadFileHandler}
                    >   
                    </Form.File>
                    {uploading && <Loader/>}
                </Form.Group>
                <Form.Group controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder='Enter Category'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder='Enter Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="countInStock">
                    <Form.Label>CountInStock</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder='Enter CountInStock'
                        value={countInStock}
                        onChange={(e) => setCountInStok(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <br></br>
                <Button type="submit" variant='primary'>Update</Button>
                </Form>
            )}
        </FormContainer>
    </div>
    )
}

export default ProductEditScreen
