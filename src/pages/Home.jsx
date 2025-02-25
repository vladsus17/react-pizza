import React from 'react';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock/index';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import { SearchContext } from '../App';

const Home = () => {
  const { searchValue } = React.useContext(SearchContext);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsloading] = React.useState(true);
  const [categoryId, setCategoryId] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortType, setSortType] = React.useState({
    name: 'popular ↑',
    sortProperty: 'rating',
  });

  const totalPages = 3;

  React.useEffect(() => {
    setIsloading(true);

    const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc';
    const sortBy = sortType.sortProperty.replace('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    fetch(
      `https://67b7308b2bddacfb270e0720.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
    )
      .then((resp) => resp.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setIsloading(false);
      });

    window.scrollTo(0, 0);
  }, [categoryId, sortType, searchValue, currentPage]);

  const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);

  const skeletons = Array.from({ length: 9 }).map((_, index) => <Skeleton key={index} />);

  const handleCategoryChange = (index) => {
    setCategoryId(index);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={handleCategoryChange} />
        <Sort value={sortType} onChangeSort={(index) => setSortType(index)} />
      </div>
      <h2 className="content_title">Todas las pizzas</h2>
      <div className="content_items">{isLoading ? skeletons : pizzas}</div>
      <Pagination
        onChangePage={(number) => setCurrentPage(number)}
        pageCount={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Home;
