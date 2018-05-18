var schema = require('../models/schema')
var util = require('./util')
var ABC = require('../models/ABC')

var courseController = {}

/**
 * @api {post} /api/course
 * @class Course
 *
 * @description All params are required
 *
 * @param {String} department Four letter representation of department
 * @param {String} number
 * @param {String} name
 * @param {String} category
 * @param {Number} hours
 * @param {String} faculty
 * @param {Object} semester
 *
 * @returns {Object} success The newly created or updated course data
 *
 * @throws {Object} InvalidDepartment
 * @throws {Object} UnknownFaculty
 * @throws {Object} UnknownSemester
 * @throws {Object} RequiredParamNotFound
 * @throws {Object} DuplicateCourse
 */
courseController.post = function (input, res) {
  schema.Semester.findOne(util.validateModelData(input, schema.Semester)).exec().then(function (result) {
    if (result !== null) throw new Error('DuplicateCourse')
    else {
      var inputCourse = new schema.Semester(util.validateModelData(input, schema.Semester))
      return inputCourse.save()
    }
  }).then(function (course) {
    res.json(course)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'course.post'})
  })
}

/**
 * @api {get} /api/course
 * @class Course
 *
 * @description At least one param is required
 *
 * @param {String} department Four letter representation of the department
 * @param {Number} number
 * @param {String} name
 * @param {String} category
 * @param {Number} hours
 * @param {String} faculty
 * @param {Object} semester
 *
 * @returns {Object} success Matching courses
 *
 * @throws {Object}
 */
/*courseController.get = function (input, res) {
    /*var a = new ABC({name: "abc"});
    a.save(function(err){
      if(err){
        res.render("../views/index");
      }
      else{
        res.json(a);
        //res.render("<% abc.name%>", {abc: a});
      }
    });*/
    /*var a = new schema.Faculty({username: "abc", firstName: "JON", lastName: "Miller", pid: 13});
    a.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.json(a);
        //res.render("<% abc.name%>", {abc: a});
      }
    });*/
    /*ABC.find({}).exec(function(err, courses){
      if(err){}
      else{
      res.render("../views/course/index", {courses: {}});
      }
    })
};*/

courseController.get = function (input, res) {
schema.Course.find(util.regexTransform(input, schema.Course)).exec().then(function (result) {
    res.json(result)
    res.render("../views/course/index", {courses: res});
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'course.get'})
  })
}

/**
 * @api {put} /api/course
 * @class Course
 *
 * @description id is required
 *
 * @param {String} id (MongoID)
 * @param {String} department Four letter representation of the department
 * @param {Number} number
 * @param {String} name
 * @param {String} category
 * @param {Number} hours
 * @param {String} faculty
 * @param {Object} semester
 *
 * @returns {Object} Newly updated course object
 *
 * @throws {Object} CourseNotFound
 */
courseController.put = function (input, res) {
  schema.Course.findOne({_id: input.id}).exec().then(function (result) {
    if (result === null) throw new Error('CourseNotFound')
    else return schema.Course.findOneAndUpdate({_id: input.id}, util.validateModelData(input, schema.Course), {new: true}).exec()
  }).then(function (result) {
    res.json(result)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'course.put'})
  })
}

/**
 * @api {delete} /api/course
 * @class Course
 *
 * @description id is required
 *
 * @param {String} id (MongoID)
 *
 * @returns {Object} Deleted course object
 *
 * @throws CourseNotFound
 */
courseController.delete = function (input, res) {
  schema.Course.findOne({_id: input.id}).exec().then(function (result) {
    if (result === null) throw new Error('CourseNotFound')
    else return schema.Course.findOneAndRemove({_id: input.id}).exec()
  }).then(function (result) {
    res.json(result)
  }).catch(function (err) {
    res.json({'error': err.message, 'origin': 'course.delete'})
  })
}


module.exports = courseController