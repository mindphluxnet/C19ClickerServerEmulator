using System;
using System.Reflection;

namespace C19Plugin
{

    public static class Reflection
    {
        public static T GetPrivateField<T>(object instance, string fieldName, bool baseType = false)
        {
            Type type = instance.GetType();
            if (baseType)
            {
                type = type.BaseType;
            }
            return (T)type.GetField(fieldName, BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic).GetValue(instance);
        }

        public static void SetPrivateField(object instance, string fieldName, object fieldValue, bool baseType = false)
        {
            Type type = instance.GetType();
            if (baseType)
            {
                type = type.BaseType;
            }
            type.GetField(fieldName, BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic).SetValue(instance, fieldValue);
        }

        public static T1 GetPrivateStaticField<T, T1>(string fieldName)
        {
            return (T1)typeof(T).GetField(fieldName, BindingFlags.Static | BindingFlags.NonPublic).GetValue(null);
        }

        public static void SetPrivateStaticField<T>(string fieldName, object fieldValue)
        {
            typeof(T).GetField(fieldName, BindingFlags.Static | BindingFlags.NonPublic).SetValue(null, fieldValue);
        }

        public static void InvokePrivateMethod(object instance, string methodName, params object[] parameters)
        {
            instance.GetType().GetMethod(methodName, BindingFlags.Instance | BindingFlags.NonPublic).Invoke(instance, parameters);
        }

        public static void InvokeEvent(object instance, string eventName, params object[] parameters)
        {
            Delegate[] invocationList = ((MulticastDelegate)instance.GetType().GetField(eventName, BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic).GetValue(instance)).GetInvocationList();
            foreach (Delegate @delegate in invocationList)
            {
                @delegate.Method.Invoke(@delegate.Target, parameters);
            }
        }

        public static void SetPrivateProperty(object instance, string propName, object value)
        {
            instance.GetType().GetProperty(propName, BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic).SetValue(instance, value, null);
        }
    }
}