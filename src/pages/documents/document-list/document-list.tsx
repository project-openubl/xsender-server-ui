import React, { useEffect } from "react";
import {
  Link,
  RouteComponentProps,
  useHistory,
  useParams,
} from "react-router-dom";

import { PageSection } from "@patternfly/react-core";

import { useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { companyContextSelectors } from "store/company-context";

import { CompanytRoute, formatPath, Paths } from "Paths";
import { SimplePageSection } from "shared/components";

import { CompanyContextSelector } from "../components/company-context-selector/company-context-selector";
import { CompanyContextSelectorSection } from "../components/company-context-selector-section";

export interface DocumentListProps extends RouteComponentProps {}

export const DocumentList: React.FC<DocumentListProps> = () => {
  const params = useParams<CompanytRoute>();
  const history = useHistory();

  const currentCompany = useSelector((state: RootState) =>
    companyContextSelectors.currentCompany(state)
  );

  useEffect(() => {
    if (params.company !== currentCompany) {
      history.push(
        formatPath(Paths.documents_byCompany, {
          company: currentCompany,
        })
      );
    }
  }, [params, history, currentCompany]);

  return (
    <>
      <CompanyContextSelectorSection>
        <CompanyContextSelector />
      </CompanyContextSelectorSection>
      <SimplePageSection title="Documents" />
      <PageSection>
        <Link
          to={formatPath(Paths.documents_byCompany_new, {
            company: params.company,
          })}
        >
          Upload
        </Link>
      </PageSection>
    </>
  );
};
