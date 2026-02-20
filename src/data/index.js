import { unit1 } from "./unit1";
import { unit2 } from "./unit2";
import { unit3 } from "./unit3";
import { unit4 } from "./unit4";
import { unit5 } from "./unit5";
import { unit6 } from "./unit6";
import { unit7 } from "./unit7";
import { unit8 } from "./unit8";
import { unit9 } from "./unit9";
import { unit10 } from "./unit10";
import { unit11 } from "./unit11"; // <--- Yeni

export const curriculum = [
  { id: "unit-1", title: "Ünite 1: ABAP Temelleri", lessons: unit1 },
  { id: "unit-2", title: "Ünite 2: Veri Yönetimi (Tables)", lessons: unit2 },
  {
    id: "unit-3",
    title: "Ünite 3: Veri ve Metin Manipülasyonu",
    lessons: unit3,
  },
  { id: "unit-4", title: "Ünite 4: Modülerleşme & OOP", lessons: unit4 },
  {
    id: "unit-5",
    title: "Ünite 5: İleri Seviye Veri & Performans",
    lessons: unit5,
  },
  { id: "unit-6", title: "Ünite 6: Tarih, Zaman ve Sistem", lessons: unit6 },
  {
    id: "unit-7",
    title: "Ünite 7: Karmaşık Yapılar & İlişkiler",
    lessons: unit7,
  },
  { id: "unit-8", title: "Ünite 8: Kullanıcı Girişleri", lessons: unit8 },
  { id: "unit-9", title: "Ünite 9: Veri Manipülasyonu (CRUD)", lessons: unit9 },
  {
    id: "unit-10",
    title: "Ünite 10: Debugging & Troubleshooting",
    lessons: unit10,
  },
  {
    id: "unit-11",
    title: "🎓 Ünite 11: Mezuniyet Projesi (Mini ERP)", // <--- Yeni
    lessons: unit11,
  },
];
