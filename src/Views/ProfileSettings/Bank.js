import React, { useState, useEffect } from 'react';
import { requests } from 'requests';
import { useToasts } from 'react-toast-notifications';
import { useForm } from 'react-hook-form';
import { ArrowRight } from 'svg';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/Button';

const BankForm = ({ setIsLoading, dispatch }) => {
  const history = useHistory();
  const { addToast } = useToasts();
  const [banks, setBanks] = useState([]);
  const [userBank, setUserBank] = useState({});
  const [accountNameLoading, setAccountNameLoading] = useState(false);
  const [account_name, setAccountName] = useState('');

  const schema = yup.object().shape({
    bank_code: yup.string(),
    account_number: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const getAccountName = async (data) => {
    setAccountNameLoading(true);
    setAccountName('');
    try {
      const { data: da_ta } = await requests.post('/bank/confirm', data);

      const { status, message } = da_ta;
      setAccountNameLoading(false);

      if (!status) {
        addToast(message, { appearance: 'error', autoDismiss: true });
        return;
      }

      if (status) {
        const { data } = da_ta;
        setAccountName(data.account_name);
        return;
      }
    } catch (err) {
      addToast(err.message || 'Failed to get account Name', {
        appearance: 'error',
        autoDismiss: true,
      });
      setAccountNameLoading(false);
      return;
    }
  };

  const onSubmit = async (data) => {
    if (!account_name.length) return;
    data.bank_id = data.bank_code;
    console.log(data);
    delete data.bank_code;
    try {
      const { status } = await requests.post('/seller/bank/update', {
        ...data,
        account_name,
      });

      if (status === 'success') {
        addToast('Successfully added bank details', {
          appearance: 'success',
          autoDismiss: true,
        });
        return history.push('/shopping');
      }
    } catch (err) {
      addToast(err.message || 'Failed to save bank details', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const onSubmitAccountNum = async (data) => await getAccountName(data);

  useEffect(() => {
    const fetchData = async () => {
      if (banks.length) return;
      const res = await requests.get('/getbanks');
      setBanks(res.data);
    };

    fetchData();
  }, [banks.length]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await requests.get('/seller/bank');
      res.data.length &&
        setUserBank({
          account_name: res.data[0].account_name,
          bank_code: res.data[0].bank_id,
          account_number: res.data[0].account_number,
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (userBank.bank_code) {
      const fields = ['bank_code', 'account_number'];
      fields.forEach((field) => setValue(field, userBank[field]));
      setAccountName(userBank.account_name);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userBank]);

  return (
    <div className='py-4'>
      <div className='flex justify-start'>
        <form
          className='flex mt-6 flex-col md:px-8 w-full'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='text-left'>
            <label className='text-sm my-2' htmlFor='bank_code'>
              Bank
            </label>
            <div className='relative md:w-full mb-6 mt-2'>
              <select
                className='border border-black w-96 md:w-full rounded-full px-6 py-2 focus:outline-none focus:shadow-xl'
                {...register('bank_code', { required: true })}
              >
                <option key='null/bank' value='0'>
                  Select Bank
                </option>
                {banks.map((e, i) => (
                  <option key={i} value={e.bank_code}>
                    {e.bank_name}
                  </option>
                ))}
              </select>
              {errors.bank_code && (
                <span className='error-span'>{errors.bank_code?.message}</span>
              )}
            </div>
          </div>

          <div className='text-left'>
            <label className='text-sm my-2' htmlFor='email'>
              Account Number
            </label>
            <div className='relative md:w-full mb-6 mt-2'>
              <input
                type='text'
                {...register('account_number')}
                onBlur={(e) => {
                  const { value } = e.target;
                  if (value.length === 10) {
                    onSubmitAccountNum({
                      bank_code: getValues('bank_code'),
                      account_number: value,
                    });
                  }
                }}
                onChange={(e) => {
                  const { value } = e.target;
                  e.target.value = value.replace(/[^0-9]/g, '');
                  if (value.length > 10) e.target.value = value.slice(0, 10);
                }}
                placeholder='Enter your account number'
                className={`border ${
                  errors.account_name ? 'border-red' : 'border-black'
                } w-full rounded-full px-6 py-2 focus:outline-none focus:shadow-xl`}
              />

              {errors.account_number && (
                <span className='error-span'>
                  {errors.account_number?.message}
                </span>
              )}
            </div>
          </div>

          <div className='text-left'>
            <label className='text-sm my-2' htmlFor='email'>
              Account Name
            </label>
            <div className='relative md:w-full mb-6 mt-2'>
              <input
                type='text'
                disabled
                placeholder='Account Name'
                value={account_name}
                className={`border 
                border-black 
                ${accountNameLoading ? 'bg-gray-200 animate-pulse' : ''}
                 w-full rounded-full px-6 py-2 focus:outline-none focus:shadow-xl`}
              />
            </div>
          </div>

          <div className='text-left'>
            <div className='my-3 flex'>
              <Button
                primary={account_name.length}
                disabled={!account_name.length}
                roundedMd
                icon={
                  <div className='animate-bounceSide'>
                    <ArrowRight color='white' />
                  </div>
                }
                text='Save Changes'
                Continue
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankForm;
