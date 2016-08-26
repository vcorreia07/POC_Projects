package com.ge;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@SuppressWarnings("serial")
@WebServlet("/SelectedWinDataController")
public class SelectedDataController extends HttpServlet {

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("in SelectedDataController");
		URL url=null;
		String inputLine = ""; 
		BufferedReader buff;
		String params = request.getParameter("winParam");
		String dbName = request.getParameter("dbName");
		System.out.println("winParam"+ params);
		System.out.println("dbName"+ dbName);
		String strJson = null;
		try{
			
			boolean isTimeSeries = new String("timeseries").equals(dbName);
			if(isTimeSeries)
			{
				url = new URL("https://adgas-winddata-timeseries-service.run.aws-usw02-pr.ice.predix.io/services/windservices/yearly_data/sensor_id/"+params);
			}
			else
			{
				url = new URL("https://mayur-predix-jpa-demo.run.aws-usw02-pr.ice.predix.io/query/yearly_data/sensor_id/"+params);
			}
			System.out.println("url"+ url);
		 URLConnection urlCon = url.openConnection(); 
			buff = new BufferedReader(new InputStreamReader(urlCon.getInputStream())); 
			while ((inputLine = buff.readLine()) != null) { 
				strJson = inputLine; 
			} 
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		response.setContentType("text/html;charset=UTF-8");
		response.getWriter().write(strJson);
	
	}





}
