import { useState, useCallback } from 'react';
import Head from 'next/head';
import Background from '../components/Background';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import MessagesPage from './MessagesPage';
import PostPage from './PostPage';
import ProfilePage from './ProfilePage';

export default function Home() {
  const [activePage, setActivePage] = useState('home');
  const [topTab, setTopTab] = useState('recommend');

  const handlePageChange = useCallback(page => {
    setActivePage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleTabChange = useCallback(tab => {
    setTopTab(tab);
    setActivePage(prev => {
      if (prev !== 'home') return 'home';
      return prev;
    });
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage activeTab={topTab} />;
      case 'search':
        return <SearchPage />;
      case 'post':
        return <PostPage onPostSuccess={() => handlePageChange('home')} />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <ProfilePage onNavigate={handlePageChange} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>数码社区</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#f2f2f7" />
      </Head>
      <Background />
      <div className="app-container">
        {activePage === 'home' && (
          <Header activeTab={topTab} onTabChange={handleTabChange} />
        )}
        <div key={activePage} className="page-enter">{renderPage()}</div>
      </div>
      <BottomNav activePage={activePage} onPageChange={handlePageChange} />
    </>
  );
}
