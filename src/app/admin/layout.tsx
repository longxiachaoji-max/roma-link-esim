"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  LockKeyhole,
  Menu,
  Pencil,
  Plus,
  Save,
  Trash2,
  X
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/admin-fetch';
import {
  ADMIN_NAVIGATION_ITEMS,
  DEFAULT_ADMIN_NAVIGATION,
  type AdminNavigationConfig
} from '@/lib/admin-navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authState, setAuthState] = useState<'checking' | 'allowed' | 'denied'>('checking');
  const [authMessage, setAuthMessage] = useState('正在驗證管理員登入狀態');
  const [navigation, setNavigation] = useState<AdminNavigationConfig>(DEFAULT_ADMIN_NAVIGATION);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Set<string>>(new Set());
  const [isNavigationEditorOpen, setIsNavigationEditorOpen] = useState(false);
  const [navigationDraft, setNavigationDraft] = useState<AdminNavigationConfig>(DEFAULT_ADMIN_NAVIGATION);
  const [isSavingNavigation, setIsSavingNavigation] = useState(false);
  const [navigationMessage, setNavigationMessage] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/admin/login') return;
    let active = true;
    adminFetch('/api/admin/session', { cache: 'no-store' })
      .then(async response => {
        const result = await response.json().catch(() => ({}));
        if (!active) return;
        if (response.ok) {
          setAuthState('allowed');
          return;
        }
        setAuthMessage(result.error || '請先登入管理員帳號');
        setAuthState('denied');
        router.replace('/admin/login');
      })
      .catch(() => {
        if (!active) return;
        setAuthMessage('無法驗證管理員登入狀態，請稍後再試');
        setAuthState('denied');
      });
    return () => { active = false; };
  }, [pathname, router]);

  useEffect(() => {
    if (authState !== 'allowed') return;
    adminFetch('/api/admin/navigation', { cache: 'no-store' })
      .then(async response => {
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || '讀取選單分類失敗');
        if (result.navigation) setNavigation(result.navigation);
      })
      .catch(error => setNavigationMessage(error instanceof Error ? error.message : '讀取選單分類失敗'));
  }, [authState]);

  useEffect(() => {
    const activeItem = ADMIN_NAVIGATION_ITEMS.find(item => (
      pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`))
    ));
    const activeCategory = navigation.categories.find(category => category.itemIds.includes(activeItem?.id || ''));
    if (!activeCategory) return;
    setExpandedCategoryIds(current => new Set(current).add(activeCategory.id));
  }, [navigation, pathname]);

  const openNavigationEditor = () => {
    setNavigationDraft(structuredClone(navigation));
    setNavigationMessage('');
    setIsNavigationEditorOpen(true);
  };

  const addNavigationCategory = () => {
    setNavigationDraft(current => ({
      categories: [
        ...current.categories,
        { id: crypto.randomUUID(), name: `新分類 ${current.categories.length + 1}`, itemIds: [] }
      ]
    }));
  };

  const updateCategoryName = (categoryId: string, name: string) => {
    setNavigationDraft(current => ({
      categories: current.categories.map(category => category.id === categoryId ? { ...category, name } : category)
    }));
  };

  const moveCategory = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= navigationDraft.categories.length) return;
    setNavigationDraft(current => {
      const categories = [...current.categories];
      [categories[index], categories[target]] = [categories[target], categories[index]];
      return { categories };
    });
  };

  const deleteCategory = (categoryId: string) => {
    if (navigationDraft.categories.length <= 1) return;
    setNavigationDraft(current => {
      const removed = current.categories.find(category => category.id === categoryId);
      const categories = current.categories.filter(category => category.id !== categoryId);
      return {
        categories: categories.map((category, index) => (
          index === 0 ? { ...category, itemIds: [...category.itemIds, ...(removed?.itemIds || [])] } : category
        ))
      };
    });
  };

  const assignItemToCategory = (itemId: string, categoryId: string) => {
    setNavigationDraft(current => ({
      categories: current.categories.map(category => ({
        ...category,
        itemIds: category.id === categoryId
          ? [...category.itemIds.filter(id => id !== itemId), itemId]
          : category.itemIds.filter(id => id !== itemId)
      }))
    }));
  };

  const saveNavigation = async () => {
    if (isSavingNavigation) return;
    if (navigationDraft.categories.some(category => !category.name.trim())) {
      setNavigationMessage('請輸入每個分類的名稱');
      return;
    }

    setIsSavingNavigation(true);
    setNavigationMessage('');
    try {
      const response = await adminFetch('/api/admin/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(navigationDraft)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || '儲存選單分類失敗');
      setNavigation(result.navigation);
      setExpandedCategoryIds(new Set(result.navigation.categories.map((category: { id: string }) => category.id)));
      setIsNavigationEditorOpen(false);
    } catch (error) {
      setNavigationMessage(error instanceof Error ? error.message : '儲存選單分類失敗');
    } finally {
      setIsSavingNavigation(false);
    }
  };

  if (pathname === '/admin/login') return <>{children}</>;

  if (authState !== 'allowed') {
    return (
      <main className="min-h-screen bg-[#0B0B1A] text-white grid place-items-center px-6">
        <div className="w-full max-w-sm text-center">
          <LockKeyhole className="mx-auto mb-5 text-cyan" size={42} />
          <h1 className="text-xl font-bold mb-2">管理後台登入保護</h1>
          <p className="text-gray-400 mb-6">
            {authState === 'checking' ? '正在驗證管理員登入狀態' : authMessage}
          </p>
          {authState === 'denied' && (
            <Link href="/" className="inline-flex px-5 py-2.5 bg-cyan text-[#0B0B1A] font-bold rounded-md">
              返回首頁登入
            </Link>
          )}
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen bg-[#0B0B1A] text-white overflow-hidden font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-[#1A1A2E] border-b border-white/10 px-4 h-16 absolute top-0 w-full z-20">
        <h1 className="text-xl font-bold text-white">管理後台</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-[#1A1A2E] border-r border-white/10 w-64 transform transition-transform duration-300 ease-in-out z-30 md:relative md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
            <h1 className="text-xl font-bold text-white hidden md:block">管理後台</h1>
            <h1 className="text-xl font-bold text-white md:hidden">選單</h1>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={openNavigationEditor}
                title="編輯選單分類"
                aria-label="編輯選單分類"
                className="grid h-9 w-9 place-items-center rounded-md text-gray-400 transition-colors hover:bg-white/10 hover:text-cyan"
              >
                <Pencil size={17} />
              </button>
              <button className="md:hidden grid h-9 w-9 place-items-center text-gray-400" onClick={() => setIsMobileMenuOpen(false)} aria-label="關閉選單">
                <X size={20} />
              </button>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-2 px-3">
              {navigation.categories.map(category => {
                const isExpanded = expandedCategoryIds.has(category.id);
                const categoryItems = category.itemIds
                  .map(itemId => ADMIN_NAVIGATION_ITEMS.find(item => item.id === itemId))
                  .filter((item): item is (typeof ADMIN_NAVIGATION_ITEMS)[number] => Boolean(item));
                return (
                  <section key={category.id}>
                    <button
                      type="button"
                      onClick={() => setExpandedCategoryIds(current => {
                        const next = new Set(current);
                        if (next.has(category.id)) next.delete(category.id);
                        else next.add(category.id);
                        return next;
                      })}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-bold text-white/55 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <span>{category.name}</span>
                      <ChevronDown size={15} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {isExpanded && (
                      <ul className="mt-1 space-y-1">
                        {categoryItems.map(item => {
                          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`));
                          return (
                            <li key={item.id}>
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors md:py-2 ${
                                  isActive
                                    ? 'bg-cyan/20 text-cyan font-bold'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                {item.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </section>
                );
              })}
              {navigationMessage && !isNavigationEditorOpen && (
                <p className="px-3 pt-2 text-xs text-rose-300">{navigationMessage}</p>
              )}
            </div>
          </nav>
        </div>
      </aside>

      {isNavigationEditorOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm" onMouseDown={() => setIsNavigationEditorOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="navigation-editor-title"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/15 bg-[#17172A] shadow-2xl"
            onMouseDown={event => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-white/10 bg-[#17172A] px-5 py-4">
              <div>
                <h2 id="navigation-editor-title" className="text-lg font-bold text-white">編輯左側選單</h2>
                <p className="mt-1 text-sm text-white/45">建立分類，再決定每個功能要放在哪一類。</p>
              </div>
              <button type="button" onClick={() => setIsNavigationEditorOpen(false)} aria-label="關閉" className="grid h-9 w-9 place-items-center rounded-md text-white/50 hover:bg-white/10 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5">
              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-white">分類名稱與順序</h3>
                  <button type="button" onClick={addNavigationCategory} className="inline-flex h-9 items-center gap-2 rounded-md border border-cyan/35 px-3 text-sm font-bold text-cyan hover:bg-cyan/10">
                    <Plus size={16} />新增分類
                  </button>
                </div>
                <div className="space-y-2">
                  {navigationDraft.categories.map((category, index) => (
                    <div key={category.id} className="flex items-center gap-2 rounded-md border border-white/10 bg-black/20 p-2">
                      <input
                        value={category.name}
                        onChange={event => updateCategoryName(category.id, event.target.value)}
                        maxLength={30}
                        aria-label={`第 ${index + 1} 個分類名稱`}
                        className="min-w-0 flex-1 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan"
                      />
                      <button type="button" onClick={() => moveCategory(index, -1)} disabled={index === 0} title="上移" className="grid h-9 w-9 place-items-center rounded-md text-white/55 hover:bg-white/10 disabled:opacity-20"><ArrowUp size={16} /></button>
                      <button type="button" onClick={() => moveCategory(index, 1)} disabled={index === navigationDraft.categories.length - 1} title="下移" className="grid h-9 w-9 place-items-center rounded-md text-white/55 hover:bg-white/10 disabled:opacity-20"><ArrowDown size={16} /></button>
                      <button type="button" onClick={() => deleteCategory(category.id)} disabled={navigationDraft.categories.length <= 1} title="刪除分類" className="grid h-9 w-9 place-items-center rounded-md text-rose-300 hover:bg-rose-400/10 disabled:opacity-20"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-bold text-white">按鈕分類</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ADMIN_NAVIGATION_ITEMS.map(item => {
                    const assignedCategory = navigationDraft.categories.find(category => category.itemIds.includes(item.id));
                    return (
                      <label key={item.id} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/20 px-3 py-2.5">
                        <span className="min-w-0 text-sm text-white/80">{item.name}</span>
                        <select
                          value={assignedCategory?.id || navigationDraft.categories[0]?.id || ''}
                          onChange={event => assignItemToCategory(item.id, event.target.value)}
                          className="max-w-[9rem] rounded-md border border-white/15 bg-[#101020] px-2 py-1.5 text-sm text-white outline-none focus:border-cyan"
                        >
                          {navigationDraft.categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name || '未命名分類'}</option>
                          ))}
                        </select>
                      </label>
                    );
                  })}
                </div>
              </section>

              {navigationMessage && (
                <p className="rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{navigationMessage}</p>
              )}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-white/10 bg-[#17172A] px-5 py-4">
              <button type="button" onClick={() => setIsNavigationEditorOpen(false)} className="h-10 rounded-md border border-white/15 px-4 text-sm font-bold text-white/65 hover:bg-white/5">取消</button>
              <button type="button" onClick={saveNavigation} disabled={isSavingNavigation} className="inline-flex h-10 items-center gap-2 rounded-md bg-cyan px-4 text-sm font-bold text-[#071018] hover:bg-cyan/90 disabled:opacity-50">
                <Save size={17} />{isSavingNavigation ? '儲存中' : '儲存分類'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full pt-16 md:pt-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
