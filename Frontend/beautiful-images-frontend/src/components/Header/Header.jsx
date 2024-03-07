import { useTranslation } from 'react-i18next';
import './header.css';
import LanguageSwitcher from '../LanguageSwitcher';

export default function Header (){
    const { t } = useTranslation();

    return(
    <div className='header-div'>
        <h1>{t('welcome')}</h1>
        <LanguageSwitcher/>
    </div>)
}