import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

type Lang = 'en' | 'fr';
const OPTIONS: { value: Lang; label: string }[] = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' }

];

export const NavLanguageSelect: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [open, setOpen] = React.useState(false);
    const btnRef = React.useRef<HTMLButtonElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);

    // fermer au clic extérieur
    React.useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!open) return;
            const t = e.target as Node;
            if (!btnRef.current?.contains(t) && !listRef.current?.contains(t)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [open]);

    // navigation clavier
    const focusItem = (idx: number) => {
        const el = listRef.current?.querySelectorAll<HTMLButtonElement>('li > button')[idx];
        el?.focus();
    };

    const currentIndex = OPTIONS.findIndex(o => o.value === language);

    const onButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
            // focus l’option courante (ou la première)
            requestAnimationFrame(() => focusItem(Math.max(0, currentIndex)));
        }
    };

    const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
        const items = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('li > button') ?? []);
        const i = items.findIndex((el) => el === document.activeElement);
        if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); focusItem(Math.min(items.length - 1, i + 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); focusItem(Math.max(0, i - 1)); }
        else if (e.key === 'Home') { e.preventDefault(); focusItem(0); }
        else if (e.key === 'End') { e.preventDefault(); focusItem(items.length - 1); }
    };

    const choose = (val: Lang) => {
        setLanguage(val);
        setOpen(false);
        btnRef.current?.focus();
    };

    return (
        <div className='select-wrapper custom-select'>
            <button
                ref={btnRef}
                type='button'
                className='nav-select nav-select-button'
                aria-haspopup='listbox'
                aria-expanded={open}
                aria-label='Choose language'
                onClick={() => setOpen(o => !o)}
                onKeyDown={onButtonKeyDown}
            >
                {OPTIONS.find(o => o.value === language)?.label ?? 'Language'}
                <span className='select-arrow' aria-hidden>▾</span>
            </button>

            {open && (
                <ul
                    ref={listRef}
                    role='listbox'
                    className='nav-select-menu'
                    tabIndex={-1}
                    onKeyDown={onListKeyDown}
                    aria-activedescendant={`lang-${language}`}
                >
                    {OPTIONS.map((opt) => (
                        <li key={opt.value}>
                            <button
                                id={`lang-${opt.value}`}
                                role='option'
                                aria-selected={language === opt.value}
                                className='nav-select-item'
                                onClick={() => choose(opt.value)}
                                type='button'
                            >
                                {opt.label}
                                {language === opt.value && <span className='check' aria-hidden><FontAwesomeIcon icon={faCheck} /></span>}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
