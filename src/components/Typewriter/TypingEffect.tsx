/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: Antony-Juicy wangshengping1064@dingtalk.com
 * @Date: 2024-11-08 23:53:20
 * @LastEditors: Antony-Juicy wangshengping1064@dingtalk.com
 * @LastEditTime: 2024-11-09 01:00:04
 * @FilePath: /react_zustand_tutorial/src/components/TypingEffect.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';
import './index.css';

const Typewriters = () => {
  const [text, setText] = useState<string>('');

  // 模拟异步获取数据
  const fetchData = async (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Hello!

I hope this message finds you well. I’m here to assist you in any way I can. Whether you have a specific question, need some guidance, or just want to chat, feel free to ask anything. My goal is to make sure you have the best experience possible, and I’m here to support you every step of the way.

Please don’t hesitate to reach out with any questions or concerns. I’m here to listen, help, and provide the information you need. Your satisfaction and comfort are my top priorities, so let me know how I can assist you today.

Looking forward to helping you!

Best regards,
[Your Name]s`);
      }, 2000);
    });
  };

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData();
      setText(data);
    };

    getData();
  }, []);

  return (
    <>
      <div className='box_container' style={{ border: text && ' 1px solid lightgrey' }}>
        {text && (
          <Typewriter
            options={{
              delay: 20, // 设置打字速度为 50 毫秒/字符
            }}
            onInit={(typewriter) => {
              if (text) {
                typewriter
                  .typeString(text)
                  .pauseFor(300) // 将暂停 300 毫秒（0.3 秒）。
                  .start(); // 开始显示动画效果。
              }
            }}
          />
        )}
      </div>
    </>
  );
};

export default Typewriters;
