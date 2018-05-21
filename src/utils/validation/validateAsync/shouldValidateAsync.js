import anyPass from 'ramda/src/anyPass'
import allPass from 'ramda/src/allPass'

const isForced = (resolverArgs, force) => force
const isValidSync = ({ fieldProps }) => fieldProps.validSync
const hasAsyncRule = ({ fieldProps }) => !!fieldProps.asyncRule
const notValidAsync = ({ fieldProps }) => !fieldProps.validAsync

export default anyPass([
  isForced,
  allPass([isValidSync, hasAsyncRule, notValidAsync]),
])
