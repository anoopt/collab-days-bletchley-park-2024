import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
import { IMultilingualSummaryWebPartProps } from './MultilingualSummaryWebPart';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export class MultilingualSummaryPropertyPane {
    public getPropertyPaneConfiguration(
        properties: IMultilingualSummaryWebPartProps,
        context: WebPartContext,
        onPropertyPaneFieldChanged: () => void
      ): IPropertyPaneConfiguration {
        return {
          pages: [
            {
              header: {
                description: "Multilingual Summary Configuration"
              },
              groups: [
                {
                  groupName: "Basic Configuration",
                  groupFields: [
                    PropertyFieldMultiSelect('languages', {
                      key: 'languages',
                      label: "Select languages",
                      options: [
                        { key: 'English', text: 'English' },
                        { key: 'French', text: 'French' },
                        { key: 'German', text: 'German' },
                        { key: 'Spanish', text: 'Spanish' },
                        { key: 'Italian', text: 'Italian' },
                        { key: 'Dutch', text: 'Dutch' }
                      ],
                      selectedKeys: properties.languages
                    })
                  ]
                }
              ]
            }
          ]
        };
      }
}