import * as React from 'react';
import { IOracleEgressSecurityRule, IOracleFirewall, IOracleSecurityRuleType } from '../../domain/IOracleFirewall';
import { HelpField, IWizardPageProps, wizardPage } from '@spinnaker/core';
import { OracleSecurityRuleRow } from './OracleSecurityRuleRow';
import { OracleReactInjector } from '../../reactShims';
import { FormikErrors } from 'formik';

export interface IOracleFirewallEgressRuleListProps extends IWizardPageProps<IOracleFirewall> {}

export class OracleEgressRuleListComponent extends React.Component<IOracleFirewallEgressRuleListProps, any> {
  public static LABEL = 'Outbound Security Rules';

  private addRule = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const { outboundRules } = this.props.formik.values;
    outboundRules.push(OracleReactInjector.oracleFirewallTransformer.constructNewEgressRule());
    this.props.formik.setFieldValue('outboundRules', outboundRules);
  };

  private deleteRule = (index: number) => {
    const { outboundRules } = this.props.formik.values;
    outboundRules.splice(index, 1);
    this.props.formik.setFieldValue('outboundRules', outboundRules);
  };

  private ruleChanged = (index: number, newRule: IOracleEgressSecurityRule) => {
    const { outboundRules } = this.props.formik.values;
    outboundRules[index] = newRule;
    this.props.formik.setFieldValue('outboundRules', outboundRules);
  };

  public validate(values: IOracleFirewall) {
    const errors = {} as FormikErrors<IOracleFirewall>;

    /*if (values.name && values.name.length > 32) {
      errors.name = 'Firewall names cannot exceed 32 characters in length';
    }*/

    return errors;
  }

  public render() {
    const { outboundRules } = this.props.formik.values;
    if (!outboundRules) {
      return <div />;
    }
    const rows: any = outboundRules.map((securityRule: IOracleEgressSecurityRule, index: number) => (
      <OracleSecurityRuleRow
        securityRule={securityRule}
        securityRuleType={IOracleSecurityRuleType.EGRESS}
        index={index}
        deleteRuleFunction={this.deleteRule}
        ruleChangedFunction={this.ruleChanged}
        key={IOracleSecurityRuleType.EGRESS + 'SecurityRule' + index}
      />
    ));

    return (
      <table className="table table-condensed packed">
        <thead>
          <tr>
            <th>
              Destination CIDR <HelpField id="oracle.firewall.cidr" />
            </th>
            <th>Destination Type</th>
            <th>Protocol</th>
            <th>Stateless</th>
            <th>
              Source Port Range <HelpField id="oracle.firewall.portRange" />
            </th>
            <th>
              Destination Port Range <HelpField id="oracle.firewall.portRange" />
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
        <tfoot>
          <tr>
            <td colSpan={6}>
              <button className="add-new col-md-12" onClick={this.addRule}>
                <span className="glyphicon glyphicon-plus-sign" />
                Add Outbound Rule
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

export const OracleEgressRuleList = wizardPage(OracleEgressRuleListComponent);
