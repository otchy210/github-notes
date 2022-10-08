import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../providers/I18nProvider';
import { dangerous } from '../../utils/dangerous';

export const Guide: React.FC = () => {
  const { t } = useI18n();
  return (
    <>
      <h2>GitHub Notes</h2>
      <p>
        {t(
          'GitHub Notes is a tool that open source version of Apple Notes or Google Keep which stores notes in your GitHub repository. So it is actually depending on Microsoft but having much better control. All your notes are written as markdown documents.'
        )}
      </p>
      <p
        dangerouslySetInnerHTML={dangerous(
          t(
            'You need to create a personal token via <a href="https://github.com/settings/tokens/new" target="_blank">this page</a> to use this tool. And the access token should have "repo" permission which provides full control of private repositories. So you may be worried if this tool does something bad. In that case, you can always check the <a href="https://github.com/otchy210/github-notes" target="_blank"> source code </a> of this tool and confirm there is no problem.'
          )
        )}
      ></p>
      <p>
        {t('Did you create your access token? Set it up here:')} <Link to="/config">{t('Config page')}</Link>
      </p>
    </>
  );
};
