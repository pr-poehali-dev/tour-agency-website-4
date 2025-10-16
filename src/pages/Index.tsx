import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Index = () => {
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [calculatorGuests, setCalculatorGuests] = useState(2);
  const [calculatorDays, setCalculatorDays] = useState(7);
  const [calculatorComfort, setCalculatorComfort] = useState('standard');
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [hotDeals, setHotDeals] = useState<any[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationDeal, setNotificationDeal] = useState<any>(null);

  const loadTours = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/f1e6a4a9-eed3-48e5-be96-ca476549ccbe');
      const data = await response.json();
      if (data.tours && data.tours.length > 0) {
        const newTours = data.tours;
        const previousHotDeals = hotDeals;
        
        const currentHotDeals = newTours.filter((tour: any) => 
          tour.category === 'горящий' || 
          tour.title?.toLowerCase().includes('горящий') ||
          tour.discount > 20
        );
        
        if (currentHotDeals.length > previousHotDeals.length) {
          const newDeal = currentHotDeals.find(
            (deal: any) => !previousHotDeals.some((prev: any) => prev.id === deal.id)
          );
          
          if (newDeal && tours.length > 0) {
            setNotificationDeal(newDeal);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 10000);
          }
        }
        
        setHotDeals(currentHotDeals);
        setTours(newTours);
        setLastUpdate(new Date());
      }
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки туров:', error);
      setLoading(false);
    }
  };

  const updateToursFromOperators = async () => {
    try {
      await fetch('https://functions.poehali.dev/f1e6a4a9-eed3-48e5-be96-ca476549ccbe', {
        method: 'POST'
      });
      await loadTours();
    } catch (error) {
      console.error('Ошибка обновления туров:', error);
    }
  };

  useEffect(() => {
    loadTours();
    updateToursFromOperators();
    
    const interval = setInterval(() => {
      updateToursFromOperators();
    }, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const staticTours = [
    { id: 1, title: 'Мальдивы Deluxe', destination: 'Мальдивы', country: 'maldives', price: 450000, priceFormatted: '450 000 ₽', duration: '7 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/24a87b57-c32e-4592-a4b2-835aba31e914.jpg', description: 'Водные бунгало 5★, снорклинг, SPA', category: 'beach' },
    { id: 2, title: 'Париж + Рим', destination: 'Франция + Италия', country: 'europe', price: 320000, priceFormatted: '320 000 ₽', duration: '10 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/4201e134-950f-43a2-b3c5-33dd2890385e.jpg', description: 'Экскурсии, музеи, мишленовские рестораны', category: 'culture' },
    { id: 3, title: 'Швейцарские Альпы', destination: 'Швейцария', country: 'europe', price: 580000, priceFormatted: '580 000 ₽', duration: '5 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/0e47a49c-602b-46bd-9b38-422c14345e66.jpg', description: 'Горные лыжи, шале люкс, частный инструктор', category: 'mountains' },
    { id: 4, title: 'Бали Тропик', destination: 'Индонезия', country: 'asia', price: 280000, priceFormatted: '280 000 ₽', duration: '8 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/24a87b57-c32e-4592-a4b2-835aba31e914.jpg', description: 'Пляжи, храмы, йога, балийский массаж', category: 'beach' },
    { id: 5, title: 'Нью-Йорк VIP', destination: 'США', country: 'america', price: 420000, priceFormatted: '420 000 ₽', duration: '6 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/4201e134-950f-43a2-b3c5-33dd2890385e.jpg', description: 'Манхэттен, Бродвей, шопинг на 5-й авеню', category: 'culture' },
    { id: 6, title: 'Токио + Киото', destination: 'Япония', country: 'asia', price: 520000, priceFormatted: '520 000 ₽', duration: '9 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/4201e134-950f-43a2-b3c5-33dd2890385e.jpg', description: 'Сакура, онсэн, традиционные рёканы', category: 'culture' },
    { id: 7, title: 'Дубай Премиум', destination: 'ОАЭ', country: 'asia', price: 380000, priceFormatted: '380 000 ₽', duration: '7 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/24a87b57-c32e-4592-a4b2-835aba31e914.jpg', description: 'Небоскрёбы, пляжи, Dubai Mall, сафари', category: 'beach' },
    { id: 8, title: 'Сейшелы Эксклюзив', destination: 'Сейшелы', country: 'maldives', price: 650000, priceFormatted: '650 000 ₽', duration: '10 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/24a87b57-c32e-4592-a4b2-835aba31e914.jpg', description: 'Райские острова, дайвинг, приватные виллы', category: 'beach' },
    { id: 9, title: 'Испания + Португалия', destination: 'Иберия', country: 'europe', price: 295000, priceFormatted: '295 000 ₽', duration: '12 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/4201e134-950f-43a2-b3c5-33dd2890385e.jpg', description: 'Барселона, Мадрид, Лиссабон, Порту', category: 'culture' },
    { id: 10, title: 'Таиланд Классик', destination: 'Таиланд', country: 'asia', price: 185000, priceFormatted: '185 000 ₽', duration: '9 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/24a87b57-c32e-4592-a4b2-835aba31e914.jpg', description: 'Пхукет, Бангкок, экскурсии, тайский массаж', category: 'beach' },
    { id: 11, title: 'Греция Острова', destination: 'Греция', country: 'europe', price: 240000, priceFormatted: '240 000 ₽', duration: '8 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/24a87b57-c32e-4592-a4b2-835aba31e914.jpg', description: 'Санторини, Крит, белые домики, море', category: 'beach' },
    { id: 12, title: 'Австрия Горная', destination: 'Австрия', country: 'europe', price: 315000, priceFormatted: '315 000 ₽', duration: '6 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/0e47a49c-602b-46bd-9b38-422c14345e66.jpg', description: 'Тироль, катание на лыжах, альпийская кухня', category: 'mountains' },
    { id: 13, title: 'Турция All Inclusive', destination: 'Турция', country: 'asia', price: 145000, priceFormatted: '145 000 ₽', duration: '7 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/24a87b57-c32e-4592-a4b2-835aba31e914.jpg', description: 'Анталия 5★, всё включено, аквапарк, хамам', category: 'beach' },
    { id: 14, title: 'Прага + Вена', destination: 'Чехия + Австрия', country: 'europe', price: 195000, priceFormatted: '195 000 ₽', duration: '7 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/4201e134-950f-43a2-b3c5-33dd2890385e.jpg', description: 'Старая Европа, замки, музеи, кафе', category: 'culture' },
    { id: 15, title: 'Шри-Ланка Эко', destination: 'Шри-Ланка', country: 'asia', price: 220000, priceFormatted: '220 000 ₽', duration: '10 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/24a87b57-c32e-4592-a4b2-835aba31e914.jpg', description: 'Джунгли, слоны, чайные плантации, океан', category: 'beach' },
    { id: 16, title: 'Канада Горы', destination: 'Канада', country: 'america', price: 475000, priceFormatted: '475 000 ₽', duration: '8 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/0e47a49c-602b-46bd-9b38-422c14345e66.jpg', description: 'Ванкувер, Скалистые горы, озёра, природа', category: 'mountains' },
    { id: 17, title: 'Мексика Карибы', destination: 'Мексика', country: 'america', price: 365000, priceFormatted: '365 000 ₽', duration: '9 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/24a87b57-c32e-4592-a4b2-835aba31e914.jpg', description: 'Канкун, Майя, сеноты, текила, пляжи', category: 'beach' },
    { id: 18, title: 'Скандинавия 4 страны', destination: 'Скандинавия', country: 'europe', price: 390000, priceFormatted: '390 000 ₽', duration: '11 дней', image: 'https://cdn.poehali.dev/projects/ea4c3f24-08ba-472c-8695-daadf72c5465/files/4201e134-950f-43a2-b3c5-33dd2890385e.jpg', description: 'Норвегия, Швеция, Дания, Финляндия', category: 'culture' }
  ];

  const displayTours = tours.length > 0 ? tours : staticTours;

  const services = [
    { id: 1, title: 'Визы', icon: 'FileText', description: 'Оформление туристических, рабочих и бизнес-виз', price: 'от 5 000 ₽' },
    { id: 2, title: 'Карты АТС', icon: 'CreditCard', description: 'Азиатские платёжные карты для путешествий', price: 'от 3 000 ₽' },
    { id: 3, title: 'Гражданство', icon: 'Award', description: 'Консультации по получению второго гражданства', price: 'от 50 000 ₽' },
    { id: 4, title: 'ПМЖ', icon: 'Home', description: 'Программы постоянного места жительства', price: 'от 100 000 ₽' },
    { id: 5, title: 'ВНЖ', icon: 'Briefcase', description: 'Вид на жительство в Европе, Азии, Америке', price: 'от 75 000 ₽' },
    { id: 6, title: 'Страхование', icon: 'Shield', description: 'Медицинская страховка для путешествий', price: 'от 1 000 ₽' }
  ];

  const filteredTours = displayTours.filter(tour => {
    const matchesDestination = selectedDestination === 'all' || tour.country === selectedDestination;
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;
    const matchesPrice = tour.price >= priceRange[0] && tour.price <= priceRange[1];
    return matchesDestination && matchesCategory && matchesPrice;
  });

  const calculateTourPrice = () => {
    const basePrice = 50000;
    const daysMultiplier = calculatorDays * 8000;
    const guestsMultiplier = calculatorGuests * 0.8;
    const comfortMultiplier = calculatorComfort === 'standard' ? 1 : calculatorComfort === 'comfort' ? 1.5 : 2.5;
    
    const total = (basePrice + daysMultiplier) * guestsMultiplier * comfortMultiplier;
    return Math.round(total);
  };

  const handleBooking = (tour: any) => {
    setSelectedTour(tour);
    setBookingDialogOpen(true);
  };

  const handleBookingSubmit = () => {
    alert(`Бронирование тура "${selectedTour?.title}" на ${startDate ? format(startDate, 'dd.MM.yyyy', { locale: ru }) : 'дату не выбрана'} успешно отправлено! Мы свяжемся с вами в ближайшее время.`);
    setBookingDialogOpen(false);
    setStartDate(undefined);
    setEndDate(undefined);
  };

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
              <span className="text-2xl font-handwriting font-bold text-primary">Слетайка.ру</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-foreground hover:text-accent transition-colors font-medium">Главная</a>
              <a href="#tours" className="text-foreground hover:text-accent transition-colors font-medium">Туры</a>
              <a href="#services" className="text-foreground hover:text-accent transition-colors font-medium">Услуги</a>
              <a href="#destinations" className="text-foreground hover:text-accent transition-colors font-medium">Направления</a>
              <a href="#reviews" className="text-foreground hover:text-accent transition-colors font-medium">Отзывы</a>
              <a href="#contact" className="text-foreground hover:text-accent transition-colors font-medium">Контакты</a>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden xl:flex flex-col items-end text-sm">
                <a href="tel:+79094264040" className="flex items-center gap-1 text-foreground hover:text-accent transition-colors font-medium">
                  <Icon name="Phone" size={16} />
                  <span>+7 909 426-40-40</span>
                </a>
                <a href="tel:+79165005500" className="flex items-center gap-1 text-foreground hover:text-accent transition-colors font-medium">
                  <Icon name="Phone" size={16} />
                  <span>+7 916 500-55-00</span>
                </a>
              </div>
              <a 
                href="https://wa.me/79094264040?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%AF%20%D0%B7%D0%B0%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BE%D0%B2%D0%B0%D0%BD%20%D0%B2%20%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%D0%B5%20%D1%82%D1%83%D1%80%D0%B0.%20%D0%9F%D0%BE%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5%20%D0%BC%D0%BD%D0%B5%20%D0%BF%D0%BE%D0%B4%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%B8%D0%B4%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%BF%D1%83%D1%82%D0%B5%D1%88%D0%B5%D1%81%D1%82%D0%B2%D0%B8%D0%B5%3F" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Icon name="MessageCircle" size={16} />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {showNotification && notificationDeal && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <Card className="w-96 border-2 border-accent shadow-2xl bg-gradient-to-br from-accent/5 to-accent/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Icon name="Flame" size={24} className="text-accent animate-pulse" />
                  <div className="absolute inset-0 bg-accent/30 blur-lg animate-pulse"></div>
                </div>
                <CardTitle className="text-lg text-accent">Горящий тур!</CardTitle>
                <button 
                  onClick={() => setShowNotification(false)}
                  className="ml-auto hover:bg-muted rounded-full p-1 transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <img 
                  src={notificationDeal.image} 
                  alt={notificationDeal.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-primary mb-1">{notificationDeal.title}</h4>
                  <p className="text-sm text-muted-foreground">{notificationDeal.destination}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-accent text-white">
                      <Icon name="TrendingDown" size={12} className="mr-1" />
                      {notificationDeal.discount || 25}%
                    </Badge>
                    {notificationDeal.source && (
                      <Badge variant="outline" className="text-xs">{notificationDeal.source}</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Специальная цена</p>
                    <p className="text-xl font-bold text-accent">{notificationDeal.priceFormatted}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-accent hover:bg-accent/90 text-white"
                    onClick={() => {
                      handleBooking(notificationDeal);
                      setShowNotification(false);
                    }}
                  >
                    Забронировать
                  </Button>
                </div>
                <a
                  href={`https://wa.me/79094264040?text=${encodeURIComponent(`🔥 Здравствуйте! Увидел(а) горящий тур "${notificationDeal.title}" за ${notificationDeal.priceFormatted}. Хочу забронировать! Когда могу вылететь?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-2 rounded-lg transition-colors text-sm"
                  onClick={() => setShowNotification(false)}
                >
                  <Icon name="MessageCircle" size={14} />
                  Написать в WhatsApp
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <section id="home" className="pt-32 pb-20 px-4 animate-fade-in">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-handwriting font-bold text-primary mb-6 leading-tight">
            Путешествия<br />вашей мечты
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Создаём незабываемые впечатления для взыскательных путешественников
          </p>
          
          <Card className="max-w-5xl mx-auto shadow-2xl border-2">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-left mb-2">Направление</label>
                  <select className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition-colors bg-white">
                    <option>Куда едем?</option>
                    <option>🏝️ Мальдивы</option>
                    <option>🗼 Европа</option>
                    <option>🏯 Азия</option>
                    <option>🗽 Америка</option>
                    <option>🦁 Африка</option>
                    <option>🏖️ Карибы</option>
                    <option>🏔️ Горы</option>
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-left mb-2">Дата вылета</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-left mb-2">Ночей</label>
                  <select className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition-colors bg-white">
                    <option>7 ночей</option>
                    <option>3-4 ночи</option>
                    <option>5-6 ночей</option>
                    <option>7-9 ночей</option>
                    <option>10-14 ночей</option>
                    <option>14+ ночей</option>
                  </select>
                </div>
                
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-left mb-2">Туристы</label>
                  <select className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-accent focus:outline-none transition-colors bg-white">
                    <option>2 взрослых</option>
                    <option>1 взрослый</option>
                    <option>2 взрослых</option>
                    <option>2 взр + 1 ребенок</option>
                    <option>2 взр + 2 детей</option>
                    <option>3 взрослых</option>
                    <option>4 взрослых</option>
                  </select>
                </div>
                
                <div className="lg:col-span-1 flex items-end">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-white py-3 h-[52px] text-base font-semibold">
                    <Icon name="Search" size={18} className="mr-2" />
                    Найти тур
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-accent hover:text-white transition-colors text-sm font-medium">
                  🔥 Горящие туры
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-accent hover:text-white transition-colors text-sm font-medium">
                  ✈️ Раннее бронирование
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-accent hover:text-white transition-colors text-sm font-medium">
                  🏖️ Пляжный отдых
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-accent hover:text-white transition-colors text-sm font-medium">
                  🎿 Горнолыжные туры
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-100 hover:bg-accent hover:text-white transition-colors text-sm font-medium">
                  🏛️ Экскурсионные туры
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {hotDeals.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <Icon name="Flame" size={32} className="text-accent animate-pulse" />
                <h2 className="text-4xl md:text-5xl font-handwriting font-bold text-accent">Горящие туры</h2>
                <Icon name="Flame" size={32} className="text-accent animate-pulse" />
              </div>
              <p className="text-lg text-muted-foreground">
                Успейте забронировать! Специальные предложения с максимальной скидкой
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotDeals.slice(0, 3).map((deal, index) => (
                <Card key={deal.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-accent/30 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={deal.image} 
                      alt={deal.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-red-600 text-white">
                        <Icon name="Flame" size={14} className="mr-1" />
                        Горит
                      </Badge>
                      {deal.discount && (
                        <Badge className="bg-accent text-white text-base px-3 py-1">
                          -{deal.discount}%
                        </Badge>
                      )}
                    </div>
                    {deal.source && (
                      <Badge className="absolute top-3 right-3 bg-primary text-white">{deal.source}</Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-handwriting">{deal.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} />
                      {deal.destination}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="Calendar" size={16} />
                        <span>{deal.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{deal.description}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 pt-4 border-t">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="text-sm text-muted-foreground">Специальная цена</p>
                        <p className="text-2xl font-bold text-accent">{deal.priceFormatted}</p>
                      </div>
                      <Button 
                        className="bg-accent hover:bg-accent/90 text-white"
                        onClick={() => handleBooking(deal)}
                      >
                        Успеть!
                      </Button>
                    </div>
                    <a
                      href={`https://wa.me/79094264040?text=${encodeURIComponent(`🔥 Здравствуйте! Увидел(а) горящий тур "${deal.title}" за ${deal.priceFormatted}. Хочу узнать подробности и забронировать!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-2 rounded-lg transition-colors"
                    >
                      <Icon name="MessageCircle" size={16} />
                      WhatsApp
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="tours" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-handwriting font-bold text-primary mb-4">Избранные туры</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Эксклюзивные предложения для роскошного отдыха
            </p>
            {lastUpdate && (
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <Icon name="RefreshCw" size={14} className="animate-pulse text-accent" />
                <span>Последнее обновление: {lastUpdate.toLocaleTimeString('ru-RU')}</span>
                <span className="text-accent">• Обновляется каждые 15 минут</span>
              </div>
            )}
            {loading && (
              <div className="flex items-center justify-center gap-2 mt-4 text-accent">
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span>Загрузка актуальных предложений...</span>
              </div>
            )}
          </div>

          <Card className="mb-8 p-6">
            <Tabs defaultValue="filters" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="filters">Фильтры</TabsTrigger>
                <TabsTrigger value="calculator">Калькулятор стоимости</TabsTrigger>
              </TabsList>
              
              <TabsContent value="filters" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Страна</Label>
                    <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите страну" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все страны</SelectItem>
                        <SelectItem value="maldives">Мальдивы</SelectItem>
                        <SelectItem value="europe">Европа</SelectItem>
                        <SelectItem value="asia">Азия</SelectItem>
                        <SelectItem value="america">Америка</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Тип отдыха</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все типы</SelectItem>
                        <SelectItem value="beach">Пляжный отдых</SelectItem>
                        <SelectItem value="culture">Культурный туризм</SelectItem>
                        <SelectItem value="mountains">Горы</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Бюджет: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000000}
                      step={50000}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="CheckCircle" size={16} className="text-accent" />
                  Найдено туров: {filteredTours.length}
                </div>
              </TabsContent>

              <TabsContent value="calculator" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Количество человек: {calculatorGuests}</Label>
                      <Slider
                        value={[calculatorGuests]}
                        onValueChange={(val) => setCalculatorGuests(val[0])}
                        min={1}
                        max={10}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Количество дней: {calculatorDays}</Label>
                      <Slider
                        value={[calculatorDays]}
                        onValueChange={(val) => setCalculatorDays(val[0])}
                        min={3}
                        max={21}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Уровень комфорта</Label>
                      <Select value={calculatorComfort} onValueChange={setCalculatorComfort}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Стандарт</SelectItem>
                          <SelectItem value="comfort">Комфорт</SelectItem>
                          <SelectItem value="luxury">Люкс</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card className="bg-accent/5 border-accent/20">
                    <CardHeader>
                      <CardTitle className="text-2xl font-serif">Расчёт стоимости</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Базовая стоимость:</span>
                        <span className="font-medium">50 000 ₽</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">За {calculatorDays} дней:</span>
                        <span className="font-medium">+ {(calculatorDays * 8000).toLocaleString()} ₽</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">За {calculatorGuests} чел.:</span>
                        <span className="font-medium">× {calculatorGuests * 0.8}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Класс {calculatorComfort === 'standard' ? 'стандарт' : calculatorComfort === 'comfort' ? 'комфорт' : 'люкс'}:</span>
                        <span className="font-medium">× {calculatorComfort === 'standard' ? '1' : calculatorComfort === 'comfort' ? '1.5' : '2.5'}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-serif font-bold">Итого:</span>
                          <span className="text-3xl font-serif font-bold text-accent">{calculateTourPrice().toLocaleString()} ₽</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour, index) => (
              <Card key={tour.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  {tour.source && (
                    <Badge className="absolute top-4 left-4 bg-primary text-white">{tour.source}</Badge>
                  )}
                  <Badge className="absolute top-4 right-4 bg-accent text-white">Люкс</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-handwriting">{tour.title}</CardTitle>
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
                    <p className="text-2xl font-bold text-primary">{tour.priceFormatted}</p>
                  </div>
                  <Button 
                    className="bg-accent hover:bg-accent/90 text-white"
                    onClick={() => handleBooking(tour)}
                  >
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
            <h2 className="text-4xl md:text-5xl font-handwriting font-bold text-primary mb-4">Популярные направления</h2>
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

      <section id="services" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-handwriting font-bold text-primary mb-4">Дополнительные услуги</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Визы, гражданство, карты и другие сервисы для путешественников
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={service.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="mb-4 w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                    <Icon name={service.icon as any} size={28} className="text-accent" />
                  </div>
                  <CardTitle className="text-xl font-handwriting">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-lg font-bold text-accent">{service.price}</span>
                  <Button variant="outline" size="sm">
                    Подробнее
                    <Icon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 px-4 bg-gradient-to-b from-muted/20 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-handwriting font-bold text-primary mb-4">Отзывы клиентов</h2>
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
            <h2 className="text-4xl md:text-5xl font-handwriting font-bold text-primary mb-4">Свяжитесь с нами</h2>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Icon name="Phone" size={32} className="text-accent mx-auto mb-3" />
                <p className="font-medium mb-2">Телефоны</p>
                <div className="space-y-1">
                  <a href="tel:+79094264040" className="block text-accent hover:underline font-medium">
                    +7 909 426-40-40
                  </a>
                  <a href="tel:+79165005500" className="block text-accent hover:underline font-medium">
                    +7 916 500-55-00
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Icon name="MessageCircle" size={32} className="text-[#25D366] mx-auto mb-3" />
                <p className="font-medium mb-2">WhatsApp</p>
                <div className="space-y-1">
                  <a 
                    href="https://wa.me/79094264040?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%AF%20%D0%B7%D0%B0%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BE%D0%B2%D0%B0%D0%BD%20%D0%B2%20%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%D0%B5%20%D1%82%D1%83%D1%80%D0%B0.%20%D0%9F%D0%BE%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5%20%D0%BC%D0%BD%D0%B5%20%D0%BF%D0%BE%D0%B4%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%B8%D0%B4%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%BF%D1%83%D1%82%D0%B5%D1%88%D0%B5%D1%81%D1%82%D0%B2%D0%B8%D0%B5%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#25D366] hover:underline font-medium"
                  >
                    +7 909 426-40-40
                  </a>
                  <a 
                    href="https://wa.me/79165005500?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%AF%20%D0%B7%D0%B0%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BE%D0%B2%D0%B0%D0%BD%20%D0%B2%20%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%D0%B5%20%D1%82%D1%83%D1%80%D0%B0.%20%D0%9F%D0%BE%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5%20%D0%BC%D0%BD%D0%B5%20%D0%BF%D0%BE%D0%B4%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%B8%D0%B4%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%BF%D1%83%D1%82%D0%B5%D1%88%D0%B5%D1%81%D1%82%D0%B2%D0%B8%D0%B5%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#25D366] hover:underline font-medium"
                  >
                    +7 916 500-55-00
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Icon name="Mail" size={32} className="text-accent mx-auto mb-3" />
                <p className="font-medium mb-2">Email</p>
                <a href="mailto:info@sletayka.ru" className="text-accent hover:underline">
                  info@sletayka.ru
                </a>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Icon name="MapPin" size={32} className="text-accent mx-auto mb-3" />
                <p className="font-medium mb-2">Адрес</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  г. Дмитров, ул. Советская д.5,<br/>
                  офис № 83<br/>
                  <span className="text-xs">(вход со стороны Лента)</span>
                </p>
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
                <li>
                  <a href="tel:+79094264040" className="hover:text-accent transition-colors">+7 909 426-40-40</a>
                </li>
                <li>
                  <a href="tel:+79165005500" className="hover:text-accent transition-colors">+7 916 500-55-00</a>
                </li>
                <li>
                  <a href="mailto:info@sletayka.ru" className="hover:text-accent transition-colors">info@sletayka.ru</a>
                </li>
                <li className="text-sm leading-relaxed">
                  г. Дмитров, ул. Советская д.5, офис № 83<br/>
                  <span className="text-xs">(вход со стороны Лента)</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-white/70">
            <p>&copy; 2024 Слетайка.ру. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/79094264040?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%AF%20%D0%B7%D0%B0%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BE%D0%B2%D0%B0%D0%BD%20%D0%B2%20%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%D0%B5%20%D1%82%D1%83%D1%80%D0%B0.%20%D0%9F%D0%BE%D0%BC%D0%BE%D0%B6%D0%B5%D1%82%D0%B5%20%D0%BC%D0%BD%D0%B5%20%D0%BF%D0%BE%D0%B4%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%B8%D0%B4%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%BF%D1%83%D1%82%D0%B5%D1%88%D0%B5%D1%81%D1%82%D0%B2%D0%B8%D0%B5%3F"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-fade-in"
        aria-label="Написать в WhatsApp"
      >
        <Icon name="MessageCircle" size={28} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
      </a>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Бронирование тура</DialogTitle>
            <DialogDescription>
              {selectedTour?.title} - {selectedTour?.destination}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Имя и фамилия</Label>
              <Input placeholder="Иван Иванов" />
            </div>

            <div className="space-y-2">
              <Label>Телефон</Label>
              <Input placeholder="+7 (___) ___-__-__" />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="email@example.com" />
            </div>

            <div className="space-y-2">
              <Label>Дата начала тура</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Icon name="Calendar" size={16} className="mr-2" />
                    {startDate ? format(startDate, 'dd MMMM yyyy', { locale: ru }) : 'Выберите дату'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Количество человек</Label>
              <Select defaultValue="2">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 человек</SelectItem>
                  <SelectItem value="2">2 человека</SelectItem>
                  <SelectItem value="3">3 человека</SelectItem>
                  <SelectItem value="4">4 человека</SelectItem>
                  <SelectItem value="5">5+ человек</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Стоимость тура:</span>
                <span className="font-medium">{selectedTour?.priceFormatted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-serif font-bold">Итого к оплате:</span>
                <span className="text-xl font-serif font-bold text-accent">{selectedTour?.priceFormatted}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
              Отмена
            </Button>
            <Button 
              className="bg-accent hover:bg-accent/90 text-white"
              onClick={handleBookingSubmit}
            >
              Подтвердить бронирование
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;