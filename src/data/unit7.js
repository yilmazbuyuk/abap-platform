export const unit7 = [
  {
    id: "u7-l1",
    tcode: "SE38",
    title: "1. İç İçe Yapılar (Nested Structures)",
    desc: "Karmaşık veri modelleri oluşturmak için bir yapının (Structure) içine başka bir yapıyı bileşen olarak eklemek.",
    code: `REPORT z_ders_u7_1_nested_structure.

* ======================================================================
* NESTED STRUCTURE (İÇ İÇE YAPI) NEDİR?
* Yazılımda "Kapsülleme" mantığına benzer. Bir kişiyi tanımlarken adını 
* ve soyadını ana alanlara yazarız; ancak adres gibi kendi içinde sokak, 
* şehir, posta kodu gibi detayları olan alanları ayrı bir kutuda (yapıda) 
* toplayıp ana kutunun içine yerleştiririz.
* ======================================================================

* 1. ADIM: ALT YAPI (ADRES BİLGİSİ)
* Önce en içteki, en küçük parçayı tanımlıyoruz.
TYPES: BEGIN OF ty_adres,
         sokak TYPE string,
         sehir TYPE string,
         pk    TYPE i,
       END OF ty_adres.

* 2. ADIM: ANA YAPI (KİŞİ BİLGİSİ)
* 'adres' alanı, yukarıda tanımladığımız 'ty_adres' tipindedir. 
* Buna ABAP dünyasında "Deep Structure" (Derin Yapı) denir.
TYPES: BEGIN OF ty_kisi,
         ad    TYPE string,
         soyad TYPE string,
         adres TYPE ty_adres, " Yapı içinde yapı!
       END OF ty_kisi.

DATA: ls_kisi TYPE ty_kisi.

START-OF-SELECTION.
  

  WRITE: '👤 ABAP DERİN VERİ MODELLEME REHBERİ'.
  WRITE: / '--------------------------------------------------'.

  " Ana alanlara doğrudan erişim
  ls_kisi-ad    = 'Mehmet'.
  ls_kisi-soyad = 'Yılmaz'.

  " 3. ADIM: İÇTEKİ YAPIYA ERİŞİM
  " İçteki bir alana ulaşmak için tire (-) işaretini zincirleme kullanırız.
  " Mantık: ls_ana_yapi-alt_yapi-alan_adi
  ls_kisi-adres-sokak = 'Atatürk Cad.'.
  ls_kisi-adres-sehir = 'Ankara'.
  ls_kisi-adres-pk    = 06100.

  " VERİLERİ EKRANA BASMA
  WRITE: / '--- ANA KİŞİ BİLGİLERİ ---'.
  WRITE: / |İsim    : { ls_kisi-ad }|.
  WRITE: / |Soyisim : { ls_kisi-soyad }|.
  
  WRITE: /.
  WRITE: / '--- ADRES DETAYLARI (ALT YAPI) ---'.
  " Alt yapının elemanlarını tek tek okuyoruz
  WRITE: / |Sokak   : { ls_kisi-adres-sokak }|.
  WRITE: / |Şehir   : { ls_kisi-adres-sehir }|.
  WRITE: / |P. Kodu : { ls_kisi-adres-pk }|.

  WRITE: /.
  WRITE: / '💡 Bilgi: Bu yöntem, veritabanı tablolarındaki'.
  WRITE: / 'APPEND STRUCTURE ve INCLUDE yapılarına benzer.'.`,
  },
  {
    id: "u7-l2",
    tcode: "SE38",
    title: "2. Başlık ve Kalem Birleştirme (JOIN Mantığı)",
    desc: "İki ayrı tabloyu (Header & Item) uygulama seviyesinde birleştirerek (Flattening) tek bir rapor tablosu oluşturmak.",
    code: `REPORT z_ders_u7_2_header_item.

* ======================================================================
* SAP VERİ MODELİ: BAŞLIK (HEADER) VE KALEM (ITEM)
* SAP'de performans için veriler bölünür. 
* Örn: VBAK (Satış Başlık) ve VBAP (Satış Kalem). 
* Rapor hazırlarken biz bu iki tabloyu "Sipariş Numarası" üzerinden 
* birleştirerek (Join) anlamlı bir bütün oluştururuz.
* ======================================================================

" 1. Adım: Başlık Veri Tipi (Örn: Siparişin Genel Bilgileri)
TYPES: BEGIN OF ty_baslik,
         siparis_no TYPE string,
         musteri    TYPE string,
       END OF ty_baslik.

" 2. Adım: Kalem Veri Tipi (Örn: Siparişteki Ürünlerin Detayı)
TYPES: BEGIN OF ty_kalem,
         siparis_no TYPE string,
         urun       TYPE string,
         adet       TYPE i,
       END OF ty_kalem.

" 3. Adım: Birleşik Rapor Tipi (İki tablonun karması)
TYPES: BEGIN OF ty_rapor,
         siparis_no TYPE string,
         musteri    TYPE string,
         urun       TYPE string,
         adet       TYPE i,
       END OF ty_rapor.

DATA: lt_baslik TYPE TABLE OF ty_baslik,
      lt_kalem  TYPE TABLE OF ty_kalem,
      lt_rapor  TYPE TABLE OF ty_rapor,
      ls_baslik TYPE ty_baslik,
      ls_kalem  TYPE ty_kalem,
      ls_rapor  TYPE ty_rapor.

START-OF-SELECTION.
  

* ======================================================================
* 1. VERİ HAZIRLIĞI (MOCK DATA)
* ======================================================================
  " Başlıklar: 1001 ve 1002 nolu siparişler
  ls_baslik-siparis_no = '1001'. ls_baslik-musteri = 'Apple TR'. APPEND ls_baslik TO lt_baslik.
  ls_baslik-siparis_no = '1002'. ls_baslik-musteri = 'Samsung TR'. APPEND ls_baslik TO lt_baslik.

  " Kalemler: Hangi siparişte hangi ürünler var?
  ls_kalem-siparis_no = '1001'. ls_kalem-urun = 'iPhone 15'. ls_kalem-adet = 2. APPEND ls_kalem TO lt_kalem.
  ls_kalem-siparis_no = '1001'. ls_kalem-urun = 'Airpods'.   ls_kalem-adet = 5. APPEND ls_kalem TO lt_kalem.
  ls_kalem-siparis_no = '1002'. ls_kalem-urun = 'Galaxy S24'. ls_kalem-adet = 3. APPEND ls_kalem TO lt_kalem.

* ======================================================================
* 2. VERİ BİRLEŞTİRME MOTORU (NESTED LOOP)
* Mantık: Önce ana listeyi (Başlık) dönüyoruz. Her bir başlık için 
* gidip kalemler tablosunda o sipariş numarasına ait satırları buluyoruz.
* ======================================================================
  WRITE: '🔄 Rapor verileri birleştiriliyor...'.
  WRITE: / '--------------------------------------------------'.

  LOOP AT lt_baslik INTO ls_baslik.
    
    " Filtreli Döngü: Sadece o anki siparişin kalemlerini getir
    LOOP AT lt_kalem INTO ls_kalem WHERE siparis_no = ls_baslik-siparis_no.
        
       " Birleştirme (Mapping): İki farklı dünyadan gelen veriyi tek yapıda topla
       CLEAR ls_rapor.
       ls_rapor-siparis_no = ls_baslik-siparis_no. " Başlık tablosundan geldi
       ls_rapor-musteri    = ls_baslik-musteri.    " Başlık tablosundan geldi
       ls_rapor-urun       = ls_kalem-urun.        " Kalem tablosundan geldi
       ls_rapor-adet       = ls_kalem-adet.        " Kalem tablosundan geldi
       
       APPEND ls_rapor TO lt_rapor.
       
    ENDLOOP.
  ENDLOOP.

* ======================================================================
* 3. SONUÇ VE GÖRSELLEŞTİRME
* ======================================================================
  WRITE: / '✅ İşlem tamamlandı. Rapor hazır.'.

  " Rapor tablosunu kullanıcıya modern bir şekilde göster
  cl_demo_output=>display( lt_rapor ).`,
  },
  {
    id: "u7-l3",
    tcode: "SE38",
    title: "3. Modern String Template (|...|)",
    desc: "Metin birleştirmede (Concatenation) devrim: Değişkenleri metin içine gömme ve anlık formatlama.",
    code: `REPORT z_ders_u7_3_string_template.

START-OF-SELECTION.
* ======================================================================
* MODERN STRING TEMPLATES (|...|)
* ABAP 7.40 sürümüyle gelen bu özellik, metin yönetimini kolaylaştırır.
* ======================================================================
  DATA: lv_ad    TYPE string VALUE 'Can',
        lv_soyad TYPE string VALUE 'Yücel',
        lv_yas   TYPE i      VALUE 35,
        lv_tarih TYPE d      VALUE sy-datum,
        lv_vbeln TYPE c LENGTH 10 VALUE '0000085632', " Hata veren değişkeni tanımladık
        lv_mesaj TYPE string.

  WRITE: '✍️ MODERN ABAP METİN YÖNETİMİ'.
  WRITE: / '--------------------------------------------------'.

  " YENİ NESİL (Zarif):
  lv_mesaj = |Sayın { lv_ad } { lv_soyad }, hoş geldiniz!|.
  WRITE: / lv_mesaj.
  WRITE: / |Şu anki yaşınız: { lv_yas }|.

* ======================================================================
* FORMATLAMA ÖZELLİKLERİ (IN-PLACE FORMATTING)
* ======================================================================
  
  
  WRITE: /.
  WRITE: / '--- 🗓️ Tarih Formatlama ---'.
  " DATE = ISO : YYYY-MM-DD formatında yazar.
  " DATE = USER: Kullanıcının SAP ayarlarındaki formatta yazar.
  WRITE: / |ISO Formatı  : { lv_tarih DATE = ISO }|.
  WRITE: / |Kullanıcı Formatı: { lv_tarih DATE = USER }|.

  WRITE: /.
  WRITE: / '--- 📏 Hizalama ve Genişlik (Layout) ---'.
  " WIDTH: Alanın toplam genişliğini belirler.
  " ALIGN: Metni o genişlik içinde sağa, sola veya ortaya yaslar.
  WRITE: / |{ 'SOL'   WIDTH = 15 ALIGN = LEFT } : Hizalandı|.
  WRITE: / |{ 'ORTA'  WIDTH = 15 ALIGN = CENTER } : Hizalandı|.
  WRITE: / |{ 'SAĞ'   WIDTH = 15 ALIGN = RIGHT } : Hizalandı|.

* ======================================================================
* ALPHA CONVERSION (ÖNEMLİ!)
* ======================================================================
  WRITE: /.
  " ALPHA = OUT: Başındaki sıfırları atarak gösterir.
  WRITE: / |Orijinal Veri : { lv_vbeln }|.
  WRITE: / |Sıfırları Atılmış: { lv_vbeln ALPHA = OUT }|. " Çıktı: 85632`,
  },
  {
    id: "u7-l4",
    tcode: "ZINVOICE",
    title: "4. Proje: Fatura Detay Raporu (Header & Item)",
    desc: "Başlık ve Kalem tablolarını Field-Symbols kullanarak performanslı bir şekilde birleştiren ve toplam tutar hesabı yapan kapsamlı rapor projesi.",
    code: `REPORT z_ders_u7_project_fatura.

* ======================================================================
* PROJE: FATURA DETAY ANALİZ RAPORU
* Amaç: Başlık (VBRK benzeri) ve Kalem (VBRP benzeri) tablolarındaki 
* verileri birleştirerek, her satır için toplam tutar hesaplayan 
* profesyonel bir liste oluşturmak.
* ======================================================================

" 1. Adım: Veri Modellerinin Tanımlanması
TYPES: BEGIN OF ty_baslik,
         fatura_no TYPE string,
         tarih      TYPE d,
         musteri    TYPE string,
       END OF ty_baslik.

TYPES: BEGIN OF ty_kalem,
         fatura_no TYPE string,
         malzeme    TYPE string,
         fiyat      TYPE i,
         adet       TYPE i,
       END OF ty_kalem.

" Raporun Nihai Yapısı (Kullanıcının Göreceği Geniş Tablo)
TYPES: BEGIN OF ty_rapor,
         fatura_no TYPE string,
         tarih      TYPE d,
         musteri    TYPE string,
         malzeme    TYPE string,
         fiyat      TYPE i,
         adet       TYPE i,
         tutar      TYPE i, " Fiyat * Adet (Runtime'da hesaplanacak)
       END OF ty_rapor.

DATA: lt_baslik TYPE TABLE OF ty_baslik,
      lt_kalem  TYPE TABLE OF ty_kalem,
      lt_rapor  TYPE TABLE OF ty_rapor,
      ls_rapor  TYPE ty_rapor.

" Performans İçin Field-Symbols Kullanımı
FIELD-SYMBOLS: <ls_baslik> TYPE ty_baslik,
               <ls_kalem>  TYPE ty_kalem.

START-OF-SELECTION.
  

* ======================================================================
* 2. VERİ HAZIRLIĞI (MOCK DATA)
* ======================================================================
  " Fatura 1: 2 Kalemli (Kalem ve Defter)
  APPEND VALUE #( fatura_no = 'FAT-001' tarih = '20240110' musteri = 'Ahmet A.' ) TO lt_baslik.
  APPEND VALUE #( fatura_no = 'FAT-001' malzeme = 'Kalem'  fiyat = 10 adet = 5 ) TO lt_kalem.
  APPEND VALUE #( fatura_no = 'FAT-001' malzeme = 'Defter' fiyat = 50 adet = 2 ) TO lt_kalem.

  " Fatura 2: Tek Kalemli (Silgi)
  APPEND VALUE #( fatura_no = 'FAT-002' tarih = '20240215' musteri = 'Selin B.' ) TO lt_baslik.
  APPEND VALUE #( fatura_no = 'FAT-002' malzeme = 'Silgi'  fiyat = 5  adet = 20 ) TO lt_kalem.

* ======================================================================
* 3. BİRLEŞTİRME VE HESAPLAMA MOTORU
* ======================================================================
  WRITE: '🚀 Rapor Motoru Çalışıyor...'.
  WRITE: / '--------------------------------------------------'.

  " Önce Başlıkları (Fatura Üst Bilgileri) Dönüyoruz
  LOOP AT lt_baslik ASSIGNING <ls_baslik>.
    
    " Her başlık için ilgili kalemleri (Ürünler) buluyoruz
    LOOP AT lt_kalem ASSIGNING <ls_kalem> WHERE fatura_no = <ls_baslik>-fatura_no.
        
       CLEAR ls_rapor.
       
       " MAPPING: Başlık ve Kalem Bilgilerini Rapor Yapısına Aktarma
       ls_rapor-fatura_no = <ls_baslik>-fatura_no.
       ls_rapor-tarih     = <ls_baslik>-tarih.
       ls_rapor-musteri   = <ls_baslik>-musteri.
       
       ls_rapor-malzeme   = <ls_kalem>-malzeme.
       ls_rapor-fiyat     = <ls_kalem>-fiyat.
       ls_rapor-adet      = <ls_kalem>-adet.
       
       " BUSINESS LOGIC: Toplam Tutar Hesaplama
       ls_rapor-tutar     = <ls_kalem>-fiyat * <ls_kalem>-adet.

       APPEND ls_rapor TO lt_rapor.
       
    ENDLOOP.
  ENDLOOP.

* ======================================================================
* 4. ÇIKTI VE GÖRSELLEŞTİRME
* ======================================================================
  WRITE: / '✅ Analiz Tamamlandı. Toplam Satır Sayısı:', lines( lt_rapor ).
  WRITE: / 'Sonuçları incelemek için ALV ekranını kullanın.'.

  " Sonuç Tablosunu ALV Grid formatında göster
  cl_demo_output=>display( lt_rapor ).`,
  },
];
