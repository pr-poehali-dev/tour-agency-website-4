import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedDestination, setSelectedDestination] = useState('all');

  const tours = [
    {
      id: 1,
      title: 'Мальдивы Премиум',
      destination: 'Мальдивы',
      price: '450 000 ₽',
      duration: '7 дней',
      image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/24a87b57-c32e-4592-a4b2-835aba31e914.jpg',
      description: 'Роскошный отдых на белоснежных пляжах с частным бунгало над водой',
      category: 'beach'
    },
    {
      id: 2,
      title: 'Европейский Шик',
      destination: 'Париж-Рим-Венеция',
      price: '320 000 ₽',
      duration: '10 дней',
      image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/4201e134-950f-43a2-b3c5-33dd2890385e.jpg',
      description: 'Погружение в европейскую культуру с проживанием в отелях класса люкс',
      category: 'culture'
    },
    {
      id: 3,
      title: 'Альпийская Роскошь',
      destination: 'Швейцария',
      price: '580 000 ₽',
      duration: '5 дней',
      image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/0e47a49c-602b-46bd-9b38-422c14345e66.jpg',
      description: 'Эксклюзивный горнолыжный курорт с личным инструктором и спа',
      category: 'mountains'
    }
  ];

  const destinations = [
    { name: 'Мальдивы', tours: 12, icon: 'Palmtree' },
    { name: 'Европа', tours: 18, icon: 'Building2' },
    { name: 'Азия', tours: 15, icon: 'Globe' },
    { name: 'Америка', tours: 8, icon: 'Map' }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Елена Соколова',
      text: 'Невероятный отдых на Мальдивах! Всё было организовано безупречно, от трансфера до последней детали в отеле.',
      rating: 5,
      tour: 'Мальдивы Премиум'
    },
    {
      id: 2,
      name: 'Дмитрий Волков',
      text: 'Европейское путешествие превзошло все ожидания. Профессиональный подход и внимание к деталям на высшем уровне.',
      rating: 5,
      tour: 'Европейский Шик'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted/30">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 animate-fade-in">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Plane" size={28} className="text-accent" />
              <span className="text-2xl font-serif font-bold text-primary">Слетайка.ру</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-foreground hover:text-accent transition-colors font-medium">Главная</a>
              <a href="#tours" className="text-foreground hover:text-accent transition-colors font-medium">Туры</a>
              <a href="#destinations" className="text-foreground hover:text-accent transition-colors font-medium">Направления</a>
              <a href="#about" className="text-foreground hover:text-accent transition-colors font-medium">О компании</a>
              <a href="#reviews" className="text-foreground hover:text-accent transition-colors font-medium">Отзывы</a>
              <a href="#contact" className="text-foreground hover:text-accent transition-colors font-medium">Контакты</a>
            </div>
            <Button className="bg-accent hover:bg-accent/90 text-white">
              <Icon name="Phone" size={16} className="mr-2" />
              Связаться
            </Button>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-4 animate-fade-in">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-6 leading-tight">
            Путешествия<br />вашей мечты
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Создаём незабываемые впечатления для взыскательных путешественников
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg">
              Подобрать тур
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg">
              Консультация
            </Button>
          </div>
        </div>
      </section>

      <section id="tours" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Избранные туры</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Эксклюзивные предложения для роскошного отдыха
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour, index) => (
              <Card key={tour.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <Badge className="absolute top-4 right-4 bg-accent text-white">Люкс</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">{tour.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <Icon name="MapPin" size={16} />
                    {tour.destination}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{tour.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Calendar" size={16} />
                      {tour.duration}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">от</p>
                    <p className="text-2xl font-bold text-primary">{tour.price}</p>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 text-white">
                    Забронировать
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="destinations" className="py-20 px-4 bg-gradient-to-b from-muted/20 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Популярные направления</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Откройте для себя лучшие места планеты
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon name={dest.icon as any} size={32} className="text-accent" />
                  </div>
                  <CardTitle className="text-xl font-serif">{dest.name}</CardTitle>
                  <CardDescription>{dest.tours} туров</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Отзывы клиентов</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Истории наших путешественников
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={18} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <CardTitle className="text-xl">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.tour}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-gradient-to-b from-muted/20 to-white">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Свяжитесь с нами</h2>
            <p className="text-lg text-muted-foreground">
              Мы подберём идеальный тур специально для вас
            </p>
          </div>

          <Card className="animate-fade-in">
            <CardContent className="pt-6">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Имя</label>
                    <Input placeholder="Ваше имя" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Телефон</label>
                    <Input placeholder="+7 (___) ___-__-__" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="email@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Направление</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите направление" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maldives">Мальдивы</SelectItem>
                      <SelectItem value="europe">Европа</SelectItem>
                      <SelectItem value="asia">Азия</SelectItem>
                      <SelectItem value="america">Америка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Сообщение</label>
                  <Textarea placeholder="Расскажите о ваших пожеланиях..." rows={4} />
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90 text-white py-6 text-lg">
                  Отправить заявку
                  <Icon name="Send" size={18} className="ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Icon name="Phone" size={32} className="text-accent mx-auto mb-3" />
                <p className="font-medium mb-1">Телефон</p>
                <p className="text-muted-foreground">+7 (495) 123-45-67</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Icon name="Mail" size={32} className="text-accent mx-auto mb-3" />
                <p className="font-medium mb-1">Email</p>
                <p className="text-muted-foreground">info@sletayka.ru</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Icon name="MapPin" size={32} className="text-accent mx-auto mb-3" />
                <p className="font-medium mb-1">Адрес</p>
                <p className="text-muted-foreground">Москва, ул. Примерная, 1</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Plane" size={24} className="text-accent" />
                <span className="text-xl font-serif font-bold">Слетайка.ру</span>
              </div>
              <p className="text-white/70">Премиальные туры для взыскательных путешественников</p>
            </div>
            <div>
              <h3 className="font-serif font-bold mb-4">Направления</h3>
              <ul className="space-y-2 text-white/70">
                <li>Мальдивы</li>
                <li>Европа</li>
                <li>Азия</li>
                <li>Америка</li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif font-bold mb-4">Компания</h3>
              <ul className="space-y-2 text-white/70">
                <li>О нас</li>
                <li>Отзывы</li>
                <li>Контакты</li>
                <li>Галерея</li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif font-bold mb-4">Контакты</h3>
              <ul className="space-y-2 text-white/70">
                <li>+7 (495) 123-45-67</li>
                <li>info@sletayka.ru</li>
                <li>Москва, ул. Примерная, 1</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/70">
            <p>&copy; 2024 Слетайка.ру. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
