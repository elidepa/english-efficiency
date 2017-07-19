
module.exports = {
  groupConfig: {
    '1': ['T1','I','I','I','I','I','I','I','T2','I','I','I','I','I','I','I','T3','I','I','I','I','I','I','I','T4','T5','T6'],
    'test': ['I','I','I','I','I','I','T2']
  },
  interventionConfig: {
    '1': {
      'I': [
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
      ],
      'T1': [
        {
          type: 'T1'
        }
      ],
      'T2': [
        {
          type: 'T2'
        }
      ],
      'T3': [
        {
          type: 'T3'
        }
      ],
      'T4': [
        {
          type: 'T4'
        }
      ],
      'T5': [
        {
          type: 'T5'
        }
      ],
      'T6': [
        {
          type: 'T6'
        }
      ]
    },
    'test': {
      'I': [
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
      ],
      'T1': [
        {
          type: 'T1'
        }
      ],
      'T2': [
        {
          type: 'T2'
        }
      ]
    }
  }
}