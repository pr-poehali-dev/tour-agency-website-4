import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение списка туров с фильтрацией и поиском
    Args: event с queryStringParameters для фильтров (destination, priceMin, priceMax, stars, category)
    Returns: JSON с массивом туров
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        import psycopg2
        from psycopg2.extras import RealDictCursor
        
        dsn = os.environ.get('DATABASE_URL')
        
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        params = event.get('queryStringParameters') or {}
        destination = params.get('destination', '')
        price_min = int(params.get('priceMin', 0))
        price_max = int(params.get('priceMax', 10000000))
        category = params.get('category', '')
        stars = params.get('stars', '')
        
        query = '''
            SELECT 
                id, title, destination, country, price, price_formatted,
                nights, departure, dates, image_url as image, rating, reviews,
                hotel, hotel_stars, included, category, meal, flight_included,
                discount, original_price, description
            FROM t_p30865444_tour_agency_website_.tours
            WHERE price >= %s AND price <= %s
        '''
        query_params = [price_min, price_max]
        
        if destination:
            query += ' AND (LOWER(destination) LIKE %s OR LOWER(country) LIKE %s)'
            search_term = f'%{destination.lower()}%'
            query_params.extend([search_term, search_term])
        
        if category:
            query += ' AND category = %s'
            query_params.append(category)
        
        if stars:
            query += ' AND hotel_stars = %s'
            query_params.append(int(stars))
        
        query += ' ORDER BY price ASC LIMIT 100'
        
        cursor.execute(query, query_params)
        tours = cursor.fetchall()
        
        result = []
        for tour in tours:
            tour_dict = dict(tour)
            result.append({
                'id': str(tour_dict['id']),
                'title': tour_dict['title'],
                'destination': tour_dict['destination'],
                'country': tour_dict['country'],
                'price': tour_dict['price'],
                'priceFormatted': tour_dict['price_formatted'],
                'originalPrice': tour_dict.get('original_price'),
                'discount': tour_dict.get('discount') or 0,
                'nights': tour_dict.get('nights') or 7,
                'departure': tour_dict.get('departure') or 'Москва',
                'dates': tour_dict.get('dates') or 'Уточняйте даты',
                'image': tour_dict.get('image') or tour_dict.get('image_url'),
                'rating': float(tour_dict.get('rating') or 4.5),
                'reviews': tour_dict.get('reviews') or 0,
                'hotel': tour_dict.get('hotel') or 'Hotel',
                'hotelStars': tour_dict.get('hotel_stars') or 4,
                'included': tour_dict.get('included') or ['Перелёт', 'Проживание'],
                'category': tour_dict['category'],
                'meal': tour_dict.get('meal') or 'Завтрак',
                'flightIncluded': tour_dict.get('flight_included', True),
                'description': tour_dict.get('description') or ''
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'tours': result,
                'total': len(result)
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            }),
            'isBase64Encoded': False
        }