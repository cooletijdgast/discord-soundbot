import chunkedMessages from '../src/bot/commands/helpers/chunkedMessages';

describe('chunkedMessages', () => {
  // 150 random words of 10 character length
  const toChunk = [
    // eslint-disable-next-line max-len
    'boUlqvcQywSupKqT62yp', 'DwvGH2wDkW5t10O04yPn', 'GGbrTIo7hSlIazuyZlKr', 'SkDoWBU2BhJTZWpjfMrx', 'XDTjz5kzdvzTvzYzdQB1', 'AXlOZlZXNGf10WEpaxfK', '1wJoIIbhnn38VFsYqhme', 'xlndSF3W3Db3zHIDDtHl', 'sXzn4u7O2iGVp9YhVpPf', 'O7N4rbkNpc6qCGUiIXG1', 'r9BIPVD6imhdVW4bqtvf', 'Ecy1ZzU0K7uNnqDwerGm', 'g3nmgKHJeXBMdCfpSXDz', '1o1YQLiIPirU57hHIzUF', 'qo7uT7qnJMvjcB3Cqns1', '5LGJBX08NxEm2vQZdKhU', 'Ex99dkCXv2DWA0Hv7PKr', 'gQYgZptErMBBu1xjHxhp', 'mWgbDRg0RhrIgeFAZl1H', 'simucphdsOKSPyBRD5Oy', 'rx8aSu1mWR5pjGhJntGb', 'FwDLSnVgFQqGWDw0y2AF', 'q9ColbsIqyYWek29HhMt', 'Dwnwd3yaJR0Q5ripS8Oa', 'ULnvM5Hwz9txXcSjdapQ', '62GlHdTmsq4yXiApThFD', '4jvPSCwheKp9yNCR9cVJ', 'BTzo3uTsjCIvorv2orFi', 'NorLo0k58wChDoUukPd0', 'RuDnoKPsabGqb8urAa6Y', 'Fu2pZaZhDfWzjw5XQXkl', '6vl4qysChCUCqS0JfHqJ', 'ei3JqmkRlUdg12EI5AGc', 'nDik35Un5tlDOYURkyao', 'QylnmYCRkni9v5vQHMep', 'XH2YERGmtzymjN482r8L', 'IHYi089mOYnUkKKrCW5v', '28qG2QoJwQhY0UA7HG1y', 'JW2yW7r1HjGbw2BCjWW1', 'yqPsY8Rhl4m6ZAOnwV21', 'EMV2FFdBrrVnxZzzsNh4', 'Lg6e1MtQNntngWRXMKka', 'IgFc3MHix0DJbZN3fTKA', 'xK5cCoZLhIq9k1kBP7Yb', 'lGBqB96LJXvWE8gfW8K8', 'OqNv1CXub121EqGdqqRW', 'VAj5r2TibP49D2TQQaOt', 'CiTMFmWqwQWukT5YoxSh', 'MCmMbe7jDoV09nlTWh68', 'B1w5a0UhHydzUWOkEzXc', 'PeDYuhliNlbDLwtszAnf', '9oF6aWMCh6Kn05lPO3zx', 'okFa2lkMRLvQ2oYw9yZ9', 'OFyZsDULxVXdZ3DOHYfW', '7kmKFEHQkUKmiXduHrjL', 'C7E7KINn1vyWsOkWZQ6j', 'YtZfqGSjRGSIT7G9A4fS', 'EIZ1yYzcvZ9LqBxtnfMi', 'gdAtY4uwPm9dMH2PrgCD', 'sN4pqMCMwKVoSGRfxIT5', 'L6HzZoQXWJnSUCx6AkEV', 'vUp8119gdCRyIPHOEoZy', 'vdhElEp3xfAKFMY3Fw5p', '2GktcsOTw1oyZJqNwRqy', 'puyiNk4uJiptQJm4beO5', '8Za3iJ9FL8NO2GUud8JN', 'nWGmRerNtBHJS7PjW5Fb', 'JlTyvmzEy0rplFOqXCnt', 'zKtlv3LX3pERZFzpHk33', 'kV5BeSINSrgkH7azbLor', 'PJxfN94gIIUtSIBuljQa', 'FZUp8JYrk3VGeDJobaYg', 'eG7FD3dxkS2VfUU6dtg4', 'OG53B9Xf3fwWSZ16YaEj', 'w5Q2dcbG1Vr6Vr0CyHBm', 'okrXfhk81rzxYTSiT4sJ', 'aDtA4J6aO0naWVsWnta3', 'h80QOfNPgx6OqIUxwHkt', 'lo8UgGytkpXVTAkEkAWD', 'llfulFj6kdUEvVQ77VKl', 'VvKT9hnild9veZ1q94xO', 'l6Y91fT6nQW04UoR3Vsq', 'lb7L21yvs4vq5TdFBK6M', 'hkloDjZtyhAYuhdajyNZ', 'AyjwxPotwPaPbnymkCTe', '1CGL4wSbyew4sWeB5wbV', 'WFN1aY8gJaOYtnumEuyQ', '4RElsQHUZSH0skPD9qbd', 'mR03G1mtfNBM9tyfJ2Et', 'n1m7PoRzk1SYzjnEPKIJ', 'dJXmIZvGK3bXql6IP1PM', 'vRoYCO1MKTs2WkdYLTEP', 'zVIHRcYZHinrSFWOHdOw', 'cvayU0OXc5mYJGu0COrv', 'pphlleWf0QcJuwpYtVh0', '5dpjiZpD4bhZUHq0dWHq', 'Blbom10cxmjXeN2aMZmG', 'tDzEzRdnprcMpjcqOdec', '82cu3NxkrWRYOLyJgyj4', 'Qv47AKYou1pKfv3QlOmW', 'RTfqv7iALqc4p9S3NUoo', 't4ho11lNEs46xdgqC1gl', 'YWQeF5Gbhyop4nMjVT7Q', 'oAvc4hyA7xUM3ZBtnMGc', 'ZAor8JplvbQi7y0zVgve', '7m3oCcgyRdQyWAGdwxvN', 'FjDeuWtK6yukCKl4g48A', 'm8IZQqUQ05GVzJ6k1j7e', 'BTHWmbNs6Am09Sv6Cj7w', '0SmXNSoxkRsmeuZpUJFN', 'JhAXWq48lMyWIEmKzsV5', 'DZwCkyrMqwwrUF2m1v8r', 'dpyUBBJqft57AMtX3wqf', 'ocQc2fAJo7XLnB1IlRj7', 'xroX2sBH6uU3H0elfpWh', '9LumywXSBAXiEwiUTyKe', 'eWAOLlatsCAmxUKCMg1h', 'nnmP1Vl1TaKLNSTxtlSf', 'UFzhN4kRzHRrcC1Uu9xu', 'vnYylgCfs3PIGB4tgOPK', 'UNek07lpi9vryFRb7P4i', '3TLyBnIAjWrNmoM8eoET', 'bQhNynrHXDxUC6IXuPb8', 'JxRjL56WeaO89dwws9A5', 'Ve0bSoShHDCy7HTVV4CB', 'qIJgQdbaTjcfiTB454ug', 'dFL9yrKFr21EANCGtwMa', 'dOwTWRf2Gvo9kYENJSxv', 'Tgp6VqWNxCDOWINB8Ymx', 'BeYdauiQlbX8bT8LOEP1', 'H7wP1uNBxco7zzZ5WI9I', 'LEPI8LMPn10bWnvuRoTl', 'vkY2txJVjKHaH0HW8pMA', 'Hg53jJfdpikgSrle6V9N', 'xa01TyEaU4OWeFozgKWp', '9loDijEmm7aQLy0SCBpS', 'B2U0aOw5PmqS20PGpF9r', 'ZzWVKMHwbiceqtNrEcdF', 'AAMDGq9BR1UEu39Mlj5Q', 'ElLXlRO72Pb72GREZtVI', 'Lz3owq3yDZw7o9pZVTKf', 'cWEjc2GHEXc4pH9bgB1u', '9jIiemvQl7wqN1fT9kQY', 'bD9jSfEEKHyhHBBROkmV', 'TYMQasIYPvwPwuKyYnBY', 'wrmJWKzZW6RbQLJIv6I9', 'OGrRqXdxNkNe8QAQHBxp', '4inD9JjIfmuYSDnkKUpw', 'v32R8wQfMkNmfSTtFI4a', 'GLOlylRyTPwsiR6jXND7'
  ];

  describe('when setting a page', () => {
    it('returns that specific chunk', () => {
      expect(chunkedMessages(toChunk, 1)).toMatchSnapshot();
    });
  });

  describe('when wanting all chunks', () => {
    it('returns that specific chunk', () => {
      expect(chunkedMessages(toChunk)).toMatchSnapshot();
    });
  });
});