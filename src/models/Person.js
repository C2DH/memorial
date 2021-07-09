export default class Person {
  constructor({
    slug = '',
    firstName = '',
    lastName = '',
    professions = [],
    birthDate = '',
    birthPlace = '',
    birthYear = 0,
    notes = '',
    convoy='',
    households=[],
  }) {
    this.slug = slug
    this.firstName = firstName
    this.lastName = lastName
    this.professions = professions
    this.birthDate = birthDate
    this.birthPlace = birthPlace
    this.birthYear = birthYear
    this.convoy = convoy
    this.notes = notes
    this.households = households
  }

  static create({ slug, data }){
    return new Person({
      slug,
      firstName: data.first_name,
      lastName: data.last_name,
      professions: data.professions,
      birthDate: data.birth_date,
      birthPlace: data.birth_place,
      deathDate: data.death_date,
      deathPlace: data.death_place,
      convoy: data.convoy,
      notes: data.notes,
      households: data.households,
      picture: data.resolutions?.thumbnail
    })
  }
}
