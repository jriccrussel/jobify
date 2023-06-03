import { FormRow, Alert, FormRowSelect } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddJob = () => {
  const {
    isEditing,
    showAlert,
    displayAlert,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createJob
  } = useAppContext()

  const handleSubmit = (e) => {
    e.preventDefault()
    // while testing

    // if (!position || !company || !jobLocation) {
    //   displayAlert()
    //   return
    // }
    if (isEditing) {
      // eventually editJob()
      return
    }
    // from CREATE_JOB_BEGIN, CREATE_JOB_SUCCESS, CREATE_JOB_ERROR
    createJob()
  }

  const handleJobInput = (e) => {
    const name = e.target.name
    const value = e.target.value
    // console.log(`${name}:${value}`)
    // handleChange({ name: e.target.name, value: e.target.value })

    // from HANDLE_CHANGE
    handleChange({ name, value })
  }

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'edit job' : 'add job'}</h3>
        {showAlert && <Alert />}

        {/* position */}
        <div className='form-center'>
          <FormRow
            type='text'
            name='position'
            value={position}
            handleChange={handleJobInput}
          />
          {/* company */}
          <FormRow
            type='text'
            name='company'
            value={company}
            handleChange={handleJobInput}
          />
          {/* location */}
          <FormRow
            type='text'
            labelText='location'
            name='jobLocation'
            value={jobLocation}
            handleChange={handleJobInput}
          />

          {/* job status */}
          {/* from FormRowSelect */}
          <FormRowSelect 
            name='status'
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
          />

          {/* job type */}
          {/* <div className='form-row'>
            <label htmlFor='jobType' className='form-label'>
              job type
            </label>

            <select
              name='jobType'
              value={jobType}
              onChange={handleJobInput}
              className='form-select'
            >
              {jobTypeOptions.map((itemValue, index) => {
                return (
                  <option key={index} value={itemValue}>
                    {itemValue}
                  </option>
                )
              })}
            </select>
          </div> */}
          {/* from FormRowSelect */}
          <FormRowSelect
            labelText='type'
            name='jobType'
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
          />

          <div className='btn-container'>
            <button
              className='btn btn-block submit-btn'
              type='submit'
              onClick={handleSubmit}
            >
              submit
            </button>
            <button
              className='btn btn-block clear-btn'
              onClick={(e) => {
                e.preventDefault()
                // from CLEAR_VALUES
                clearValues()
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  )
}

export default AddJob