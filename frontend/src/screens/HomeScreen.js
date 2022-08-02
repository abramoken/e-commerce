import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import ProductCarousel from '../components/ProductCarousel'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { listProducts } from '../actions/productActions'

function HomeScreen({ history }) {
    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)
    const { error, loading, products, page, pages } = productList

    let keyword = history.location.search

    useEffect(() => {
        dispatch(listProducts(keyword))
    }, [dispatch, keyword])

    return (
        <div>
            {!keyword && <ProductCarousel />}
            <h1>Latest Products</h1>
            {loading ? <Loader />
                : error ? <Message variant='danger'>{error}</Message>
                    : 
                    <div>
                        <Row className='h-100'>
                            {products.map(product => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3} className='h-100'>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <Row className='align-items-center p-5'>
                            <Col md={4}></Col>
                            <Col md={4}>
                                <Paginate page={page} pages={pages} keyword={keyword} />
                            </Col>
                            <Col md={4}></Col>
                        </Row>
                    </div>
            }

        </div>
    )
}

export default HomeScreen
