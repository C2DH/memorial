export default class Person {
  constructor({
    firstName = '',
    lastName = '',
    professions = [],
    birthDate = '',
    birthPlace = '',
    birthYear = 0,
    notes = '',
    convoy=''
  }) {
    this.firstName = firstName
    this.lastName = lastName
    this.professions = professions
    this.birthDate = birthDate
    this.birthPlace = birthPlace
    this.birthYear = birthYear
    this.convoy = convoy
    this.notes = notes
  }
}
