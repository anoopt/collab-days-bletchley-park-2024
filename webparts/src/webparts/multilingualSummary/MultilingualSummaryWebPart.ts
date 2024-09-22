import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import MultilingualSummary from './components/MultilingualSummary';
import { IMultilingualSummaryProps } from './components/IMultilingualSummaryProps';
import { MultilingualSummaryPropertyPane } from './MultilingualSummaryPropertyPane';

export interface IMultilingualSummaryWebPartProps {
  languages: string[];
}

export default class MultilingualSummaryWebPart extends BaseClientSideWebPart<IMultilingualSummaryWebPartProps> {

  private _deferredPropertyPane: MultilingualSummaryPropertyPane;
  private refreshSummary: boolean = false;

  public render(): void {

    const listItem: any = this.context.pageContext.listItem;
    const element: React.ReactElement<IMultilingualSummaryProps> = React.createElement(
      MultilingualSummary,
      {
        spHttpClient: this.context.spHttpClient,
        aadHttpClientFactory: this.context.aadHttpClientFactory,
        msGraphClientFactory: this.context.msGraphClientFactory,
        pageItemId: listItem.id,
        pageId: listItem.uniqueId,
        siteId: this.context.pageContext.site.id.toString(),
        siteUrl: this.context.pageContext.site.absoluteUrl,
        languages: this.properties.languages,
        refreshSummary: this.refreshSummary
      }
    );
    
    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {

    // check if query string refreshSummary is set to true
    // if so, set the refreshSummary flag to true
    const queryString = new URLSearchParams(window.location.search);
    if (queryString.get('refreshSummary') === 'true') {
      this.refreshSummary = true;
    }

    return super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'MultilingualSummary-property-pane'*/
      './MultilingualSummaryPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.MultilingualSummaryPropertyPane();
        }
      );
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration(this.properties, this.context, this.onPropertyPaneFieldChanged.bind(this));
  }
}
