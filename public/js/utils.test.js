import {Formatter} from './utils'

describe('Formatter', () => {

  test('pad', () => {
    expect(Formatter.pad(0)).toEqual('00')
    expect(Formatter.pad(1,3)).toEqual('001')
    expect(Formatter.pad(100)).toEqual('100')
  })

  test('ms2hms', () => {
    expect(Formatter.ms2hms(60000)).toEqual('00:01:00')
    expect(Formatter.ms2hms(3600000)).toEqual('01:00:00')
    expect(Formatter.ms2hms(3660000)).toEqual('01:01:00')
  })

})