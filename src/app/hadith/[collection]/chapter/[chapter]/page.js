'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import HadithView from '@/components/hadith/HadithView';
import { getHadithsByChapterPaginated } from '@/lib/hadithApi';
import { HADITH_COLLECTIONS } from '@/data/hadithCollections';
import styles from './chapter.module.css';

const HADITHS_PER_PAGE = 20;

export default function ChapterPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const collectionSlug = params.collection;
  const chapterNumber = params.chapter;
  
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [chapterInfo, setChapterInfo] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const collection = HADITH_COLLECTIONS.find(c => c.slug === collectionSlug);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    async function fetchHadiths() {
      setLoading(true);
      console.log(`Fetching hadiths for ${collectionSlug}, chapter ${chapterNumber}, page ${currentPage}`);
      try {
        const data = await getHadithsByChapterPaginated(collectionSlug, chapterNumber, currentPage, HADITHS_PER_PAGE);
        let hadithsList = data.hadiths?.data || data.hadiths || [];
        
        // Sort hadiths by hadith number to show them in correct order
        hadithsList = hadithsList.sort((a, b) => {
          const numA = parseInt(a.hadithNumber, 10) || 0;
          const numB = parseInt(b.hadithNumber, 10) || 0;
          return numA - numB;
        });
        
        console.log(`Hadiths received for chapter ${chapterNumber}: ${hadithsList.length}`);
        setHadiths(hadithsList);
        
        // Set pagination info
        if (data.hadiths) {
          setPagination({
            currentPage: data.hadiths.current_page || currentPage,
            totalPages: data.hadiths.last_page || 1,
            total: data.hadiths.total || hadithsList.length
          });
        }
        
        // Get chapter info from first hadith
        if (hadithsList.length > 0) {
          setChapterInfo({
            english: hadithsList[0].chapterEnglish || hadithsList[0].chapter?.chapterEnglish,
            arabic: hadithsList[0].chapterArabic || hadithsList[0].chapter?.chapterArabic
          });
        }
      } catch (error) {
        console.error('Error fetching hadiths:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHadiths();
  }, [collectionSlug, chapterNumber, currentPage]);

  const filteredHadiths = hadiths.filter(hadith => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      hadith.hadithEnglish?.toLowerCase().includes(query) ||
      hadith.hadithUrdu?.includes(searchQuery.trim()) ||
      hadith.englishNarrator?.toLowerCase().includes(query) ||
      hadith.hadithNumber?.toString().includes(query)
    );
  });

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      router.push(`/hadith/${collectionSlug}/chapter/${chapterNumber}?page=${page}`);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!collection) {
    return (
      <div className="container">
        <p className={styles.errorMessage}>Collection not found</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div className="container">
          <button onClick={() => router.push(`/hadith/${collectionSlug}`)} className={styles.backButton}>
            <ArrowLeft size={20} />
            <span>Back to Chapters</span>
          </button>

          <h1 className={styles.collectionName}>{collection.name}</h1>
          
          {chapterInfo && (
            <>
              <h2 className={styles.chapterArabic}>{chapterInfo.arabic}</h2>
              <h3 className={styles.chapterEnglish}>
                Chapter {chapterNumber}: {chapterInfo.english}
              </h3>
            </>
          )}

          <p className={styles.hadithCount}>
            {pagination.total} hadiths in this chapter • Page {pagination.currentPage} of {pagination.totalPages}
          </p>

          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Search in this chapter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      <div className="container">
        {filteredHadiths.length > 0 ? (
          <>
            {filteredHadiths.map(hadith => (
              <HadithView 
                key={hadith.id || hadith.hadithNumber} 
                hadith={hadith} 
                collectionName={collection.slug}
              />
            ))}
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button 
                  onClick={() => goToPage(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className={styles.pageButton}
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                
                <div className={styles.pageNumbers}>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`${styles.pageNumber} ${pageNum === pagination.currentPage ? styles.activePage : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button 
                  onClick={() => goToPage(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className={styles.pageButton}
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <p className={styles.emptyMessage}>
            {searchQuery ? 'No hadiths found matching your search.' : 'No hadiths available in this chapter.'}
          </p>
        )}
      </div>
    </>
  );
}
