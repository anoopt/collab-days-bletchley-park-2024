import { SPHttpClient, AadHttpClientFactory, MSGraphClientFactory } from "@microsoft/sp-http"; 
export interface IMultilingualSummaryProps {
  spHttpClient: SPHttpClient;
  aadHttpClientFactory: AadHttpClientFactory;
  msGraphClientFactory: MSGraphClientFactory;
  pageItemId: number;
  pageId: string;
  siteId: string;
  siteUrl: string;
  languages: string[];
  refreshSummary?: boolean;
  inEditMode?:boolean;
}
