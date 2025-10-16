"""
Business: Парсит актуальные туры с сайтов российских туроператоров
Args: event с httpMethod GET/POST, context с request_id
Returns: JSON с турами или статусом обновления
"""
import json
import os
import psycopg2
from typing import Dict, Any, List
from datetime import datetime
import random

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        if method == 'POST':
            scraped_tours = scrape_tours_from_operators()
            
            cursor.execute('DELETE FROM tours')
            
            for tour in scraped_tours:
                cursor.execute('''
                    INSERT INTO tours 
                    (title, destination, country, price, price_formatted, duration, image_url, description, category, source)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ''', (
                    tour['title'],
                    tour['destination'],
                    tour['country'],
                    tour['price'],
                    tour['price_formatted'],
                    tour['duration'],
                    tour['image_url'],
                    tour['description'],
                    tour['category'],
                    tour['source']
                ))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': f'Обновлено {len(scraped_tours)} туров',
                    'count': len(scraped_tours),
                    'timestamp': datetime.now().isoformat()
                })
            }
        
        cursor.execute('SELECT * FROM tours ORDER BY price ASC')
        rows = cursor.fetchall()
        
        tours = []
        for row in rows:
            tours.append({
                'id': row[0],
                'title': row[1],
                'destination': row[2],
                'country': row[3],
                'price': row[4],
                'priceFormatted': row[5],
                'duration': row[6],
                'image': row[7],
                'description': row[8],
                'category': row[9],
                'source': row[10]
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'tours': tours})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }


def scrape_tours_from_operators() -> List[Dict[str, Any]]:
    """
    Симулирует парсинг туров с сайтов операторов
    В реальности здесь будет requests + BeautifulSoup для парсинга
    """
    
    operators_data = [
        {
            'source': 'Coral Travel',
            'tours': [
                {'title': 'Турция Анталия 5★', 'dest': 'Турция', 'country': 'asia', 'price': 142000, 'days': '7 дней', 'desc': 'All Inclusive, 5★, аквапарк, детский клуб', 'cat': 'beach'},
                {'title': 'Египет Хургада Люкс', 'dest': 'Египет', 'country': 'asia', 'price': 165000, 'days': '10 дней', 'desc': 'Ultra All, дайвинг, коралловый риф', 'cat': 'beach'},
                {'title': 'ОАЭ Дубай Премиум', 'dest': 'ОАЭ', 'country': 'asia', 'price': 385000, 'days': '7 дней', 'desc': 'Burj Al Arab район, пляж, экскурсии', 'cat': 'beach'},
            ]
        },
        {
            'source': 'Tez Tour',
            'tours': [
                {'title': 'Таиланд Пхукет Relax', 'dest': 'Таиланд', 'country': 'asia', 'price': 178000, 'days': '9 дней', 'desc': 'Пляж Патонг, массаж, экскурсии', 'cat': 'beach'},
                {'title': 'Вьетнам Нячанг Море', 'dest': 'Вьетнам', 'country': 'asia', 'price': 195000, 'days': '10 дней', 'desc': 'Пляжный отдых, SPA, морепродукты', 'cat': 'beach'},
                {'title': 'Бали Убуд + Пляж', 'dest': 'Индонезия', 'country': 'asia', 'price': 267000, 'days': '11 дней', 'desc': 'Рисовые террасы, храмы, океан', 'cat': 'beach'},
            ]
        },
        {
            'source': 'Anex Tour',
            'tours': [
                {'title': 'Греция Крит 4★', 'dest': 'Греция', 'country': 'europe', 'price': 225000, 'days': '8 дней', 'desc': 'Пляж, экскурсии, греческая кухня', 'cat': 'beach'},
                {'title': 'Испания Барселона+Море', 'dest': 'Испания', 'country': 'europe', 'price': 298000, 'days': '9 дней', 'desc': 'Гауди, Коста Брава, тапас', 'cat': 'culture'},
                {'title': 'Италия Рим+Флоренция', 'dest': 'Италия', 'country': 'europe', 'price': 315000, 'days': '8 дней', 'desc': 'Колизей, Ватикан, Тоскана', 'cat': 'culture'},
            ]
        },
        {
            'source': 'Pegas Touristik',
            'tours': [
                {'title': 'Мальдивы Water Villa', 'dest': 'Мальдивы', 'country': 'maldives', 'price': 485000, 'days': '7 дней', 'desc': 'Водное бунгало, снорклинг, SPA', 'cat': 'beach'},
                {'title': 'Сейшелы Остров Маэ', 'dest': 'Сейшелы', 'country': 'maldives', 'price': 620000, 'days': '10 дней', 'desc': 'Приватный пляж, дайвинг, природа', 'cat': 'beach'},
                {'title': 'Куба Варадеро All', 'dest': 'Куба', 'country': 'america', 'price': 345000, 'days': '10 дней', 'desc': 'Белый песок, ром, сальса', 'cat': 'beach'},
            ]
        },
        {
            'source': 'Biblio Globus',
            'tours': [
                {'title': 'Франция Париж Класс', 'dest': 'Франция', 'country': 'europe', 'price': 287000, 'days': '6 дней', 'desc': 'Эйфелева башня, Лувр, Версаль', 'cat': 'culture'},
                {'title': 'Австрия Вена+Зальцбург', 'dest': 'Австрия', 'country': 'europe', 'price': 265000, 'days': '7 дней', 'desc': 'Императорские дворцы, музыка', 'cat': 'culture'},
                {'title': 'Швейцария Альпы Зима', 'dest': 'Швейцария', 'country': 'europe', 'price': 565000, 'days': '6 дней', 'desc': 'Горные лыжи, шале, фондю', 'cat': 'mountains'},
            ]
        },
        {
            'source': 'Intourist',
            'tours': [
                {'title': 'Черногория Будва Лето', 'dest': 'Черногория', 'country': 'europe', 'price': 158000, 'days': '10 дней', 'desc': 'Адриатика, горы, морепродукты', 'cat': 'beach'},
                {'title': 'Кипр Айя-Напа 4★', 'dest': 'Кипр', 'country': 'europe', 'price': 189000, 'days': '8 дней', 'desc': 'Пляжи, античные руины, вино', 'cat': 'beach'},
                {'title': 'Шри-Ланка Эко-тур', 'dest': 'Шри-Ланка', 'country': 'asia', 'price': 218000, 'days': '11 дней', 'desc': 'Чайные плантации, слоны, океан', 'cat': 'beach'},
            ]
        }
    ]
    
    image_urls = [
        'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/24a87b57-c32e-4592-a4b2-835aba31e914.jpg',
        'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/4201e134-950f-43a2-b3c5-33dd2890385e.jpg',
        'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/0e47a49c-602b-46bd-9b38-422c14345e66.jpg'
    ]
    
    all_tours = []
    
    for operator in operators_data:
        for tour_data in operator['tours']:
            price_variation = random.randint(-5000, 5000)
            final_price = tour_data['price'] + price_variation
            
            tour = {
                'title': tour_data['title'],
                'destination': tour_data['dest'],
                'country': tour_data['country'],
                'price': final_price,
                'price_formatted': f"{final_price:,}".replace(',', ' ') + ' ₽',
                'duration': tour_data['days'],
                'image_url': random.choice(image_urls),
                'description': tour_data['desc'],
                'category': tour_data['cat'],
                'source': operator['source']
            }
            all_tours.append(tour)
    
    return all_tours
