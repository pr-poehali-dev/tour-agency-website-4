import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Tour {
  id: string;
  title: string;
  destination: string;
  country: string;
  price: number;
  priceFormatted: string;
  originalPrice?: number;
  discount?: number;
  nights: number;
  departure: string;
  dates: string;
  image: string;
  rating: number;
  reviews: number;
  hotel: string;
  hotelStars: number;
  included: string[];
  category: string;
  meal: string;
  flightIncluded: boolean;
  description?: string;
}

const Index = () => {
  const [searchParams, setSearchParams] = useState({
    destination: '',
    dateFrom: '',
    nights: '7',
    tourists: '2'
  });
  
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 1000000,
    stars: [] as number[],
    meal: [] as string[],
    categories: [] as string[]
  });
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('price-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://functions.poehali.dev/b605e28f-e6ae-4aeb-a834-211663f79467');
        const data = await response.json();
        if (data.tours && data.tours.length > 0) {
          setTours(data.tours);
          setFilteredTours(data.tours);
        }
      } catch (error) {
        console.error('Failed to load tours:', error);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tours, filters, searchParams, sortBy]);

  const applyFilters = () => {
    let result = [...tours];

    if (searchParams.destination) {
      result = result.filter(tour => 
        tour.destination.toLowerCase().includes(searchParams.destination.toLowerCase()) ||
        tour.country.toLowerCase().includes(searchParams.destination.toLowerCase())
      );
    }

    if (filters.priceMin > 0 || filters.priceMax < 1000000) {
      result = result.filter(tour => 
        tour.price >= filters.priceMin && tour.price <= filters.priceMax
      );
    }

    if (filters.stars.length > 0) {
      result = result.filter(tour => filters.stars.includes(tour.hotelStars));
    }

    if (filters.meal.length > 0) {
      result = result.filter(tour => filters.meal.includes(tour.meal));
    }

    if (filters.categories.length > 0) {
      result = result.filter(tour => filters.categories.includes(tour.category));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
    }

    setFilteredTours(result);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const toggleFavorite = (tourId: string) => {
    setFavorites(prev => 
      prev.includes(tourId) 
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const toggleCompare = (tourId: string) => {
    setCompareList(prev => 
      prev.includes(tourId)
        ? prev.filter(id => id !== tourId)
        : prev.length < 3 ? [...prev, tourId] : prev
    );
  };

  const openBookingDialog = (tour: Tour) => {
    setSelectedTour(tour);
    setBookingDialogOpen(true);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const bookingData = {
      tourId: selectedTour?.id,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      tourists: formData.get('tourists'),
      comment: formData.get('comment')
    };

    try {
      const response = await fetch('https://functions.poehali.dev/c1128ef4-597b-4175-837b-718edf0da020', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();
      
      if (result.success) {
        const message = `🎫 Заявка ${result.bookingNumber}\n\nТур: ${selectedTour?.title}\nНаправление: ${selectedTour?.destination}\nЦена: ${selectedTour?.priceFormatted}\n\nИмя: ${bookingData.name}\nТелефон: ${bookingData.phone}\nEmail: ${bookingData.email}\nТуристов: ${bookingData.tourists}\n\nКомментарий: ${bookingData.comment}`;
        
        window.open(`https://wa.me/79094264040?text=${encodeURIComponent(message)}`, '_blank');
        alert(`✅ ${result.message}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Произошла ошибка. Пожалуйста, позвоните нам напрямую.');
    }
    
    setBookingDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <Icon name="Plane" size={28} className="text-accent" />
              <span className="text-2xl font-serif font-bold text-primary">Слетайка.ру</span>
            </div>
            <div className="hidden lg:flex items-center gap-6">
              <a href="#search" className="text-foreground hover:text-accent transition-colors font-medium">Поиск туров</a>
              <a href="#hot" className="text-foreground hover:text-accent transition-colors font-medium">Горящие туры</a>
              <a href="#countries" className="text-foreground hover:text-accent transition-colors font-medium">Направления</a>
              <a href="#about" className="text-foreground hover:text-accent transition-colors font-medium">О нас</a>
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
                href="https://wa.me/79094264040?text=Здравствуйте!%20Я%20заинтересован%20в%20подборе%20тура.%20Поможете%20мне%20подобрать%20идеальное%20путешествие?"
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

      <section id="search" className="pt-32 pb-12 px-4 bg-gradient-to-b from-accent/5 to-background">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-handwriting font-bold text-primary mb-4 text-center">
            Найдите свой идеальный тур
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
            Более 1000 направлений по всему миру. Лучшие цены и сервис.
          </p>

          <Card className="shadow-2xl border-2">
            <CardContent className="p-6">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Направление</label>
                    <Input 
                      placeholder="Куда хотите поехать?"
                      value={searchParams.destination}
                      onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                      className="h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Дата вылета</label>
                    <Input 
                      type="date"
                      value={searchParams.dateFrom}
                      onChange={(e) => setSearchParams({...searchParams, dateFrom: e.target.value})}
                      className="h-12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Ночей</label>
                    <select 
                      value={searchParams.nights}
                      onChange={(e) => setSearchParams({...searchParams, nights: e.target.value})}
                      className="w-full h-12 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="3">3-4 ночи</option>
                      <option value="5">5-6 ночей</option>
                      <option value="7">7-9 ночей</option>
                      <option value="10">10-14 ночей</option>
                      <option value="14">14+ ночей</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Туристы</label>
                    <select 
                      value={searchParams.tourists}
                      onChange={(e) => setSearchParams({...searchParams, tourists: e.target.value})}
                      className="w-full h-12 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="1">1 взрослый</option>
                      <option value="2">2 взрослых</option>
                      <option value="3">2 взр + 1 ребенок</option>
                      <option value="4">2 взр + 2 детей</option>
                      <option value="5">3 взрослых</option>
                      <option value="6">4 взрослых</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 h-12 text-base font-semibold">
                      <Icon name="Search" size={18} className="mr-2" />
                      Найти
                    </Button>
                  </div>
                </div>
              </form>

              <div className="flex flex-wrap gap-2 mt-6">
                {['горящий', 'пляжный', 'горнолыжный', 'экскурсионный'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      const newCats = filters.categories.includes(cat)
                        ? filters.categories.filter(c => c !== cat)
                        : [...filters.categories, cat];
                      setFilters({...filters, categories: newCats});
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filters.categories.includes(cat)
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 hover:bg-accent/20'
                    }`}
                  >
                    {cat === 'горящий' && '🔥'} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="SlidersHorizontal" size={20} />
                    Фильтры
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">Цена, ₽</label>
                    <div className="space-y-2">
                      <Input 
                        type="number" 
                        placeholder="От"
                        value={filters.priceMin}
                        onChange={(e) => setFilters({...filters, priceMin: Number(e.target.value)})}
                      />
                      <Input 
                        type="number" 
                        placeholder="До"
                        value={filters.priceMax}
                        onChange={(e) => setFilters({...filters, priceMax: Number(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Звёзды отеля</label>
                    <div className="space-y-2">
                      {[5, 4, 3].map(stars => (
                        <label key={stars} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.stars.includes(stars)}
                            onChange={() => {
                              const newStars = filters.stars.includes(stars)
                                ? filters.stars.filter(s => s !== stars)
                                : [...filters.stars, stars];
                              setFilters({...filters, stars: newStars});
                            }}
                            className="rounded"
                          />
                          <span className="flex items-center gap-1">
                            {Array(stars).fill('⭐').join('')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3">Питание</label>
                    <div className="space-y-2">
                      {['Все включено', 'Завтрак', 'Полупансион'].map(meal => (
                        <label key={meal} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.meal.includes(meal)}
                            onChange={() => {
                              const newMeal = filters.meal.includes(meal)
                                ? filters.meal.filter(m => m !== meal)
                                : [...filters.meal, meal];
                              setFilters({...filters, meal: newMeal});
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{meal}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setFilters({
                      priceMin: 0,
                      priceMax: 1000000,
                      stars: [],
                      meal: [],
                      categories: []
                    })}
                  >
                    Сбросить фильтры
                  </Button>
                </CardContent>
              </Card>
            </aside>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    Найдено туров: <strong className="text-foreground">{filteredTours.length}</strong>
                  </span>
                  {compareList.length > 0 && (
                    <Badge variant="outline" className="cursor-pointer">
                      <Icon name="Scale" size={14} className="mr-1" />
                      Сравнить ({compareList.length})
                    </Badge>
                  )}
                  {favorites.length > 0 && (
                    <Badge variant="outline" className="cursor-pointer">
                      <Icon name="Heart" size={14} className="mr-1" />
                      Избранное ({favorites.length})
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="price-asc">Сначала дешевле</option>
                    <option value="price-desc">Сначала дороже</option>
                    <option value="rating">По рейтингу</option>
                    <option value="discount">По скидке</option>
                  </select>

                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Icon name="Grid3x3" size={16} />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <Icon name="List" size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                      <CardContent className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
                }>
                  {filteredTours.map(tour => (
                    <Card key={tour.id} className="group hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="relative">
                        <img 
                          src={tour.image} 
                          alt={tour.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {tour.discount && (
                          <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                            <Icon name="TrendingDown" size={12} className="mr-1" />
                            -{tour.discount}%
                          </Badge>
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => toggleFavorite(tour.id)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                          >
                            <Icon 
                              name="Heart" 
                              size={18} 
                              className={favorites.includes(tour.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                            />
                          </button>
                          <button
                            onClick={() => toggleCompare(tour.id)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                          >
                            <Icon 
                              name="Scale" 
                              size={18} 
                              className={compareList.includes(tour.id) ? 'fill-accent text-accent' : 'text-gray-600'}
                            />
                          </button>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{tour.category}</Badge>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Icon name="Star" size={14} className="fill-yellow-500" />
                            <span className="text-sm font-medium">{tour.rating}</span>
                            <span className="text-xs text-muted-foreground">({tour.reviews})</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{tour.title}</h3>
                        
                        <div className="space-y-1 mb-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Icon name="MapPin" size={14} />
                            <span>{tour.destination}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Building2" size={14} />
                            <span>{tour.hotel} {'⭐'.repeat(tour.hotelStars)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Calendar" size={14} />
                            <span>{tour.nights} ночей • {tour.dates}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Utensils" size={14} />
                            <span>{tour.meal}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {tour.included.slice(0, 3).map((item, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{item}</Badge>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0 flex items-center justify-between">
                        <div>
                          {tour.originalPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              {tour.originalPrice.toLocaleString()} ₽
                            </p>
                          )}
                          <p className="text-2xl font-bold text-accent">{tour.priceFormatted}</p>
                          <p className="text-xs text-muted-foreground">на человека</p>
                        </div>
                        <Button 
                          onClick={() => openBookingDialog(tour)}
                          className="bg-accent hover:bg-accent/90"
                        >
                          Забронировать
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}

              {filteredTours.length === 0 && !loading && (
                <Card className="p-12 text-center">
                  <Icon name="SearchX" size={64} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Туры не найдены</h3>
                  <p className="text-muted-foreground mb-6">
                    Попробуйте изменить параметры поиска или сбросить фильтры
                  </p>
                  <Button onClick={() => {
                    setSearchParams({destination: '', dateFrom: '', nights: '7', tourists: '2'});
                    setFilters({priceMin: 0, priceMax: 1000000, stars: [], meal: [], categories: []});
                  }}>
                    Сбросить все фильтры
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Бронирование тура</DialogTitle>
            <DialogDescription>
              {selectedTour && (
                <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                  <h4 className="font-bold text-lg text-foreground mb-2">{selectedTour.title}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={14} />
                      <span>{selectedTour.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={14} />
                      <span>{selectedTour.nights} ночей</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Building2" size={14} />
                      <span>{selectedTour.hotel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-accent font-bold">
                      <Icon name="Wallet" size={14} />
                      <span>{selectedTour.priceFormatted}</span>
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBooking} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ваше имя *</label>
                <Input name="name" placeholder="Иван Иванов" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Телефон *</label>
                <Input name="phone" type="tel" placeholder="+7 (999) 123-45-67" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input name="email" type="email" placeholder="ivan@example.com" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Количество туристов</label>
              <select name="tourists" className="w-full px-3 py-2 rounded-md border border-input bg-background">
                <option>1 человек</option>
                <option>2 человека</option>
                <option>3 человека</option>
                <option>4 человека</option>
                <option>5+ человек</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Комментарий</label>
              <Textarea 
                name="comment"
                placeholder="Особые пожелания, вопросы..."
                rows={4}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setBookingDialogOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90">
                <Icon name="Send" size={16} className="mr-2" />
                Отправить заявку
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <footer className="bg-primary text-white py-12 px-4 mt-20">
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
    </div>
  );
};

export default Index;