
module.exports = {
  groupConfig: {
    '1': ['I','I','I','I','I','I','T2'],
    'test': ['I','I','I','I','I','I','T2']
  },
  interventionConfig: {
    '1': {
      
    },
    'test': {
      'I': [
        {
          type: 'A',
          duration: 30000
        },
        {
          type: 'M',
          duration: 30000
        },
        {
          type: 'V',
          duration: 30000
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