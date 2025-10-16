import json
import os
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обработка заявок на бронирование туров
    Args: event с POST данными (tourId, name, email, phone, tourists, comment)
    Returns: Подтверждение бронирования с номером заявки
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
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
        
        body_data = json.loads(event.get('body', '{}'))
        
        tour_id = body_data.get('tourId')
        name = body_data.get('name', '').strip()
        email = body_data.get('email', '').strip()
        phone = body_data.get('phone', '').strip()
        tourists = body_data.get('tourists', '2 человека')
        comment = body_data.get('comment', '')
        
        if not all([tour_id, name, email, phone]):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Missing required fields',
                    'required': ['tourId', 'name', 'email', 'phone']
                }),
                'isBase64Encoded': False
            }
        
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS t_p30865444_tour_agency_website_.bookings (
                id SERIAL PRIMARY KEY,
                tour_id INTEGER NOT NULL,
                customer_name VARCHAR(255) NOT NULL,
                customer_email VARCHAR(255) NOT NULL,
                customer_phone VARCHAR(50) NOT NULL,
                tourists VARCHAR(100),
                comment TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        
        cursor.execute('''
            INSERT INTO t_p30865444_tour_agency_website_.bookings 
            (tour_id, customer_name, customer_email, customer_phone, tourists, comment)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        ''', (tour_id, name, email, phone, tourists, comment))
        
        booking_id = cursor.fetchone()['id']
        conn.commit()
        
        cursor.execute('''
            SELECT title, destination, price_formatted 
            FROM t_p30865444_tour_agency_website_.tours 
            WHERE id = %s
        ''', (tour_id,))
        tour = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        booking_number = f'BK{booking_id:06d}'
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'bookingNumber': booking_number,
                'bookingId': booking_id,
                'tour': {
                    'title': tour['title'] if tour else 'Тур',
                    'destination': tour['destination'] if tour else '',
                    'price': tour['price_formatted'] if tour else ''
                },
                'customer': {
                    'name': name,
                    'email': email,
                    'phone': phone
                },
                'message': f'Заявка #{booking_number} принята! Мы свяжемся с вами в ближайшее время.'
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
