import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../providers/I18nProvider';

type Props = {
  navShown: boolean;
  hideNav: () => void;
};

export const Nav: React.FC<Props> = ({ navShown, hideNav }: Props) => {
  const { t } = useI18n();
  const left = navShown ? '0' : '-100%';
  return (
    <nav style={{ left }}>
      <ul>
        <li>
          <Link to="/" onClick={() => hideNav()} className="text">
            {t('Home')}
          </Link>
        </li>
        <li>
          <Link to="/config" onClick={() => hideNav()} className="text">
            {t('Config')}
          </Link>
        </li>
      </ul>
    </nav>
  );
};
