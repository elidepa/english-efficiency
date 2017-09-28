
module.exports = {
  groupConfig: {
    '1': ['T1','I','I','I','I','I','I','I','I','T2','I','I','I','I','I','I','I','T3','I','I','I','I','I','I','LI','T4','T5','T6'],
    'ashlea.evans@dwp.gsi.gov.uk': ['T1','I','I','I','T2','I','I','I','I','I','I','I','T3','I','I','I','I','I','I','LI','T4','T5','T6'],
    'test': ['LI','I','I','I','I','I','I','I']
  },
  interventionConfig: {
    '1': {
      'I': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'A',
            duration: 480000
          },
          {
            type: 'M',
            duration: 480000
          },
          {
            type: 'V',
            duration: 480000
          }
        ]
      },
      'LI': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'A',
            duration: 480000
          },
          {
            type: 'M',
            duration: 480000
          },
          {
            type: 'V',
            duration: 480000
          }
        ]
      },
      'T1': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'T',
            sentences: 'T1'
          }
        ]
      },
      'T2': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'T',
            sentences: 'T2'
          }
        ]
      },
      'T3': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'T',
            sentences: 'T3'
          }
        ]
      },
      'T4': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'T',
            sentences: 'T4'
          }
        ]
      },
      'T5': {
        minTimeFromLast: 2419200000,
        interventions: [
          {
            type: 'T',
            sentences: 'T5'
          }
        ]
      },
      'T6': {
        minTimeFromLast: 2419200000,
        interventions: [
          {
            type: 'T',
            sentences: 'T6'
          }
        ]
      }
    },
    'test': {
      'I': {
        minTimeFromLast: 10000,
        interventions: [
          {
            type: 'A',
            duration: 120000
          },
          {
            type: 'M',
            duration: 120000
          },
          {
            type: 'V',
            duration: 120000
          }
        ]
      },
      'LI': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'A',
            duration: 1000
          },
          {
            type: 'M',
            duration: 1000
          },
          {
            type: 'V',
            duration: 1000
          }
        ]
      },
      'T1': {
        minTimeFromLast: 10000,
        interventions: [
          {
            type: 'T',
            sentences: 'T1'
          }
        ]
      },
      'T2': {
        minTimeFromLast: 10000,
        interventions: [
          {
            type: 'T',
            sentences: 'T2'
          }
        ]
      },
      'T3': {
        minTimeFromLast: 10000,
        interventions: [
          {
            type: 'T',
            sentences: 'T3'
          }
        ]
      },
      'T4': {
        minTimeFromLast: 10000,
        interventions: [
          {
            type: 'T',
            sentences: 'T4'
          }
        ]
      },
      'T5': {
        minTimeFromLast: 10000,
        interventions: [
          {
            type: 'T',
            sentences: 'T5'
          }
        ]
      },
      'T6': {
        minTimeFromLast: 10000,
        interventions: [
          {
            type: 'T',
            sentences: 'T6'
          }
        ]
      }
    },
    'ashlea.evans@dwp.gsi.gov.uk': {
      'I': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'A',
            duration: 480000
          },
          {
            type: 'M',
            duration: 480000
          },
          {
            type: 'V',
            duration: 480000
          }
        ]
      },
      'LI': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'A',
            duration: 480000
          },
          {
            type: 'M',
            duration: 480000
          },
          {
            type: 'V',
            duration: 480000
          }
        ]
      },
      'T1': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'T',
            sentences: 'T1'
          }
        ]
      },
      'T2': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'T',
            sentences: 'T2'
          }
        ]
      },
      'T3': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'T',
            sentences: 'T3'
          }
        ]
      },
      'T4': {
        minTimeFromLast: 14400000,
        interventions: [
          {
            type: 'T',
            sentences: 'T4'
          }
        ]
      },
      'T5': {
        minTimeFromLast: 2419200000,
        interventions: [
          {
            type: 'T',
            sentences: 'T5'
          }
        ]
      },
      'T6': {
        minTimeFromLast: 2419200000,
        interventions: [
          {
            type: 'T',
            sentences: 'T6'
          }
        ]
      }
    },
  }
}