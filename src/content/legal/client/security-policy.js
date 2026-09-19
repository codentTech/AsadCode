export default {
  title: "CleerCut Security and Incident Response Policy",
  lastUpdated: "September 18, 2026",
  sections: [
    {
      heading: "Entity and Contact",
      paragraphs: [
        "Entity: CleerCut LLC",
        "Contact: hello@cleercut.com",
      ],
    },
    {
      heading: "1. Purpose and Scope",
      paragraphs: [
        'This policy describes how CleerCut LLC ("CleerCut") protects the data entrusted to it by the brands and agencies that use its platform (each a "Client"), including data accessed through connected third-party integrations. A Client may be a brand or an agency acting on behalf of its own clients. This policy also describes how CleerCut responds to security incidents.',
        "This policy applies to all CleerCut personnel, contractors, and service providers who access Client data, and to all systems that store or process it.",
      ],
    },
    {
      heading: "2. Data CleerCut Protects",
      paragraphs: [
        "CleerCut handles the following broad categories of Client-related data:",
        "Platform and campaign data: information used to operate the CleerCut platform, including Client and creator account information, company and billing information, creator profiles and applications, campaign details, platform messages, deliverables, payment and payout status, and shipping information where required for campaign fulfilment.",
        "Connected integration data: data accessed from third-party services connected or authorized by a Client. Depending on the integration and features used, this may include order identifiers, dates, product information, order values, attribution codes, catalogue information, and fulfilment status. Customer identity information is not used for creator attribution or displayed in CleerCut's reporting.",
        "Some integrations may send event notifications containing information beyond the fields used for a particular CleerCut feature. CleerCut limits its use of integration data to operating the authorized connection, preventing duplicate event processing, and providing the applicable campaign, attribution, and reporting functionality. Customer identity information is not used for creator attribution or displayed in CleerCut's reporting. CleerCut does not store customer card numbers or payment credentials.",
      ],
    },
    {
      heading: "3. Access Controls",
      paragraphs: [
        "Access to Client data is limited to authorized CleerCut personnel who require it for operational or support purposes.",
        "• Access is granted on a least-privilege basis, limited to what each person needs to perform their role.",
        "• Each Client's connected integrations and associated data are linked specifically to that Client's CleerCut account. Other Clients cannot access another Client's integration data, campaign information, transactions, or attribution codes through their accounts.",
        "• When a team member accesses a Client account using CleerCut's impersonation functionality, that activity is logged.",
        "• For completeness, CleerCut does not currently maintain an application-level audit record of every infrastructure-level database access, and does not represent otherwise.",
        "Authorized CleerCut personnel and contractors may access platform systems internationally where necessary to develop, maintain, or support the Services. See Section 8.",
      ],
    },
    {
      heading: "4. Data Storage and Encryption",
      paragraphs: [
        "• CleerCut's application data is hosted on Microsoft Azure. Data is encrypted in transit, and Azure provides encryption of data at rest.",
        "• Each Client's data is logically separated so that one Client cannot access another Client's data.",
        "• Payment card and bank details are never stored by CleerCut; they are handled directly by the payment provider (Stripe / Stripe Connect).",
      ],
    },
    {
      heading: "5. Third-Party Integration Security",
      paragraphs: [
        "• Third-party integrations use the provider's supported authorization method, such as OAuth where available. CleerCut does not request a Client's ordinary account password or staff login credentials.",
        "• Integration providers display or otherwise authorize the permissions requested before the Client approves or enables the connection.",
        "• CleerCut uses integration permissions only to provide the functionality authorized by the Client. Depending on the integration, this may include reading information for attribution, product selection, or fulfilment tracking, and creating campaign-related objects such as gift orders or creator discount codes. CleerCut does not use integration access to modify unrelated Client content or records.",
        "• On disconnection, CleerCut disables or removes the active connection credential, as applicable, and stops making authenticated requests through that connection. A Client may also revoke CleerCut's authorization directly through the relevant integration provider.",
      ],
    },
    {
      heading: "6. Service Providers and Third Parties",
      paragraphs: [
        "CleerCut uses a limited set of established service providers to operate the platform, including cloud hosting, storage, email, payment, and monitoring providers. Each is used only where necessary to deliver the relevant CleerCut functionality, with appropriate security, contractual, and data-protection safeguards.",
        "Connecting a third-party service to CleerCut does not mean data from that service is automatically shared across CleerCut's providers. Data is handled only where required for the relevant functionality. Current service providers include Microsoft Azure (hosting and storage) and Stripe / Stripe Connect (payments and payouts). CleerCut also integrates with third-party platforms such as Shopify at a Client's direction. CleerCut can provide further detail on its service providers and their purposes as part of a Client's security or data-protection review.",
        "CleerCut does not sell Client data, does not use it to train artificial intelligence models, does not incorporate it into cross-customer benchmarks, and does not use one Client's data for another Client or for unrelated product development.",
      ],
    },
    {
      heading: "7. Incident Response",
      paragraphs: [
        "CleerCut maintains a process to detect, contain, and respond to security incidents affecting Client data.",
        "Detection and containment: on becoming aware of a suspected incident, CleerCut works to contain it and assess its scope and impact.",
        "Notification: where an incident affects a Client's personal data, CleerCut will notify the affected Client without undue delay and, where feasible, within 72 hours of becoming aware of the incident, consistent with applicable law.",
        "Notification contents: notice will describe, to the extent known, the nature of the incident, the categories of data involved, the likely consequences, and the measures taken or proposed in response.",
        "Remediation: after containment, CleerCut investigates root cause and takes steps to prevent recurrence.",
        "The primary contact for security matters and incident notifications is hello@cleercut.com.",
      ],
    },
    {
      heading: "8. International Access and Data Transfers",
      paragraphs: [
        "CleerCut is a California-based company and hosts its application data on Microsoft Azure. Authorized CleerCut personnel and contractors may access platform systems internationally where necessary to develop, maintain, or support the Services. Such access is subject to role-based access controls, confidentiality obligations, and applicable data-protection safeguards. Where CleerCut processes personal data subject to international data-transfer restrictions, CleerCut will implement appropriate safeguards required by applicable law. Additional transfer terms may be documented in a Data Processing Agreement where required.",
      ],
    },
    {
      heading: "9. Data Retention and Deletion",
      paragraphs: [
        "• Client data is retained while the Client's account remains active and as needed to provide the Services.",
        "• On disconnection of a third-party integration, CleerCut stops accessing new data through that connection. Disconnection does not automatically delete historical campaign, transaction, attribution, or operational records already created in CleerCut. A Client may request removal of eligible records from CleerCut's live database, subject to applicable legal, contractual, and operational retention requirements.",
        "• Backups are full-database snapshots rather than per-Client backups, so a single Client's records cannot be selectively removed from an existing backup. Backup copies are removed according to CleerCut's backup retention schedule, currently 14 days. CleerCut does not represent that data is immediately deleted from existing backups, because that is not how the backup process operates.",
        "• Financial transaction records may be retained where required by law.",
      ],
    },
    {
      heading: "10. Changes to This Policy",
      paragraphs: [
        'CleerCut may update this policy as its practices and systems evolve. Material changes will be reflected in the "Last updated" date above.',
        "For questions about this policy, contact hello@cleercut.com.",
      ],
    },
  ],
};
