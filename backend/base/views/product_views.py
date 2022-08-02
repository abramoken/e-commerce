from django.shortcuts import render

from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from base.models import Product, Review

from base.serializers import ProductSerializer


from rest_framework import status


# Products Serialized Data Endpoint
@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('search')
    if query == None:
        query = ''
    products = Product.objects.filter(name__icontains=query)
    # Pagination
    page = request.query_params.get('page')
    paginator = Paginator(products, 5)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1
    
    page = int(page)

    serializer = ProductSerializer(products, many=True)
    return Response({'products':serializer.data, 'page':page, 'pages':paginator.num_pages})

# Get Top Rated Products Endpoint
@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# Product Serialized Data Endpoint
@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

# Create Product FrontEnd Endpoint
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user = user,
        name = 'Sample Name',
        brand = 'Sample Brand',
        category = 'Sample Category',
        description = 'Sample Description',
        price = 0,
        countInStock = 0
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

# Update Product FrontEnd Endpoint
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.brand = data['brand']
    product.category = data['category']
    product.description = data['description']
    product.price = data['price']
    product.countInStock = data['countInStock']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

# Delete Product Endpoint
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    productForDelete = Product.objects.get(_id=pk)
    productForDelete.delete()
    return Response('Product was Deleted!')

# Upload Image Endpoint
@api_view(['POST'])
def uploadImage(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image was Uploaded Successfully!')

# Product Review Endpoint
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data
    # Review Already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        content = {'detail':'Product Already Revied'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    # No rating or 0
    elif data['rating'] == 0:
        content = {'detail': 'Please select a Rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    # Create Review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )
        # Get all reviews set
        reviews = product.review_set.all()
        product.numReviews = len(reviews)
        # Calculate the Rating
        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review was Added Successfully!')

