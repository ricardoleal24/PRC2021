[
  {
    'repeat(100)': {
      _id: '{{objectId()}}',
      name: {
        first: '{{firstName()}}',
        last: '{{surname()}}'
      },
      fullname(tags) {
        return	`${this.name.first} ${this.name.last}`;
      },
      nickname(tags) {
        return	`${this.name.first[0]}${this.name.last[0]}`.toLowerCase();
      },
      age: '{{integer(20, 40)}}',
      number: 'A{{integer(100, 85000)}}',
      ucs(tags) {
        const ucs = ['prc', 'pri', 'vf', 'ac'];
        return [ucs[tags.integer(0, ucs.length - 1)], ucs[tags.integer(0, ucs.length - 1)]];
      }
    }
  }
]