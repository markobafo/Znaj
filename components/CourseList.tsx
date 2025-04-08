import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import sanityClient from "@/lib/sanityClient";

const CourseList = () => {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [language, setLanguage] = useState("HR");
  const [selectedCategory, setSelectedCategory] = useState("Sve");
  const [selectedLevel, setSelectedLevel] = useState("Sve");
  const [sortBy, setSortBy] = useState("default");
  const ITEMS_PER_PAGE = 6;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const showMore = () => setVisibleCount((prev) => prev + ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await sanityClient.fetch(`*[_type == "course"]{
        title, slug, instructor, price, category, level, description,
        "image": image.asset->url,
        seo
      }`);
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const categories = ["Sve", ...new Set(courses.map(c => c.category))];
  const levels = ["Sve", ...new Set(courses.map(c => c.level))];
  const languages = ["HR", "EN"];

  const filteredCourses = courses.filter(course => {
    const matchCat = selectedCategory === "Sve" || course.category === selectedCategory;
    const matchLvl = selectedLevel === "Sve" || course.level === selectedLevel;
    return matchCat && matchLvl;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "price-asc") return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === "price-desc") return parseFloat(b.price) - parseFloat(a.price);
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <div className="overflow-x-auto flex gap-4 py-4 scrollbar-hide">
        {courses.slice(0, 4).map((course, index) => (
          <div key={index} className="min-w-[250px] bg-white border rounded-xl shadow p-4 flex-shrink-0">
            <img src={course.image} alt={course.title} className="rounded-md mb-2 w-full h-32 object-cover" />
            <h3 className="text-md font-semibold mb-1">{course.title}</h3>
            <p className="text-sm text-gray-500">{course.instructor}</p>
            <p className="text-sm text-gray-700 font-bold">{course.price}</p>
            <Button
              className="w-full mt-2"
              onClick={() => router.push(`/tecaj/${course.slug}`)}
            >
              {language === "EN" ? "View Course" : "Pogledaj"}
            </Button>
          </div>
        ))}
      </div>

      <h1 className="text-4xl font-bold text-center">
        {language === "EN" ? "All Courses" : "Svi tečajevi"}
      </h1>

      <div className="flex justify-end">
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="mb-4 border rounded px-4 py-2 text-sm">
          {languages.map((lang, idx) => (
            <option key={idx} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat, idx) => (
          <button key={idx} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} shadow`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {levels.map((lvl, idx) => (
          <button key={idx} onClick={() => setSelectedLevel(lvl)} className={`px-4 py-2 rounded-full border ${selectedLevel === lvl ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700'} shadow`}>
            {lvl}
          </button>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-4 py-2 text-sm">
          <option value="default">{language === "EN" ? "Sort by" : "Sortiraj po"}</option>
          <option value="price-asc">{language === "EN" ? "Price: Low to High" : "Cijena: rastuće"}</option>
          <option value="price-desc">{language === "EN" ? "Price: High to Low" : "Cijena: padajuće"}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sortedCourses.slice(0, visibleCount).map((course, index) => (
          <Card key={index} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-sm text-gray-600">{course.instructor}</p>
              <p className="text-base text-gray-600 italic">{course.category}</p>
              <p className="text-sm text-yellow-700">{course.level}</p>
              <p className="text-lg font-bold">{course.price}</p>
              <Button className="w-full" onClick={() => router.push(`/tecaj/${course.slug}`)}>
                {language === "EN" ? "View Course" : "Pogledaj tečaj"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {visibleCount < sortedCourses.length && (
        <div className="text-center">
          <Button onClick={showMore} className="mt-6 px-6 py-2">
            {language === "EN" ? "Load more" : "Učitaj još"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseList;
